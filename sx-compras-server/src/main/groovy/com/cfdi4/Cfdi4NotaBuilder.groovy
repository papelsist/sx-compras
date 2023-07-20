package com.cfdi4

import groovy.util.logging.Slf4j
import org.bouncycastle.util.encoders.Base64

import sx.cfdi.DateUtils
import com.cfdi4.catalogos.CMetodoPago
import com.cfdi4.catalogos.CTipoDeComprobante
import com.cfdi4.catalogos.CTipoFactor
import com.cfdi4.catalogos.CUsoCFDI
import com.cfdi4.comprobante.Comprobante
import com.cfdi4.comprobante.ObjectFactory
import sx.cxc.NotaDeCreditoDet
import sx.utils.MonedaUtils
import sx.core.Empresa
import sx.core.VentaDet
import sx.cxc.CuentaPorCobrar
import sx.cxc.NotaDeCredito
import sx.inventario.DevolucionDeVenta
import sx.inventario.DevolucionDeVentaDet


@Slf4j
class Cfdi4NotaBuilder {

    private factory = new ObjectFactory()
    private Comprobante comprobante
    private Empresa empresa

    private NotaDeCredito nota
    private DevolucionDeVenta rmd

    private BigDecimal subTotalAcumulado = 0.0
    private BigDecimal descuentoAcumulado = 0.0
    private BigDecimal totalImpuestosTrasladados = 0.0
    private BigDecimal baseTraslados = 0.0

    CfdiSellador4 cfdiSellador4 

    def build(NotaDeCredito nota){
        this.rmd = null
        this.nota = nota
        this.empresa = Empresa.first()
        subTotalAcumulado = 0.0
        descuentoAcumulado = 0.0
        this.baseTraslados = 0.0
        this.totalImpuestosTrasladados = 0.0
        this.subTotalAcumulado = 0.0
        this.descuentoAcumulado = 0.0
        if (nota.tipo.startsWith('DEV')){
            // rmd = DevolucionDeVenta.where{ cobro == this.nota.cobro}.find()
            rmd = nota.devolucion
            if(rmd == null)
              throw new RuntimeException('No existe RMD asociado a la nota')

        }
        buildComprobante()
            .buildEmisor()
            .buildReceptor()
            .buildFormaDePago()
            .buildConceptos()
            .buildImpuestos()
            .buildTotales()
            .buildCertificado()
            .buildRelacionados()
        comprobante = cfdiSellador4.sellar(comprobante, empresa)
        return comprobante
    }


    def buildComprobante(){
        log.info("Generando CFDI Version 4.0 para Nota de credito {} {} - {} ", nota.tipo, nota.serie, nota.folio)
        this.comprobante = factory.createComprobante()
        comprobante.version = "4.0"
        comprobante.tipoDeComprobante = CTipoDeComprobante.E
        comprobante.serie = nota.serie
        comprobante.folio = nota.folio.toString()
        comprobante.setFecha(DateUtils.getCfdiDate(new Date()))
        comprobante.moneda =  V4CfdiUtils.getMonedaCode(nota.moneda)
        comprobante.exportacion = '01'
        if(nota.moneda != MonedaUtils.PESOS){
            comprobante.tipoCambio = nota.tc
        }
        comprobante.lugarExpedicion = empresa.direccion.codigoPostal
        return this
    }

    def buildEmisor(){
        Comprobante.Emisor emisor = factory.createComprobanteEmisor()
        emisor.rfc = empresa.rfc
        if(empresa.rfc == 'PAP830101CR3'){
            emisor.nombre = 'PAPEL'
        }else{
            emisor.nombre = empresa.nombre
        }
        
        emisor.regimenFiscal = empresa.regimenClaveSat ?:'601'
        comprobante.emisor = emisor
        return this
    }
    def buildReceptor(){
        Comprobante.Receptor receptor = factory.createComprobanteReceptor()
        receptor.rfc = nota.cliente.rfc
        receptor.nombre = nota.cliente.razon_social
        receptor.domicilioFiscalReceptor = nota.cliente.direccion.codigoPostal
         receptor.regimenFiscalReceptor = nota.cliente.regimen_fiscal
        receptor.usoCFDI = CUsoCFDI.G_02
        if(nota.tipo == 'ANTICIPO') {
          receptor.usoCFDI = CUsoCFDI.G_01
        }
        comprobante.receptor = receptor
        return this
    }

    def buildFormaDePago() {
      // ANTICIPO
      if(nota.tipo == 'ANTICIPO') {
        comprobante.metodoPago = CMetodoPago.PUE
        comprobante.formaPago = '99'
        return this
      }
      comprobante.metodoPago = CMetodoPago.PUE
      if (nota.tipoCartera == 'CRE') {
        if(nota.formaDePago == null)
          comprobante.formaPago = '99'
        else {
          comprobante.formaPago = nota.formaDePago
        }
      } else {
        if (this.nota.tipo.startsWith('DEV')) {
          buildFormaDePagoDevolucionContado()
        } else {
          buildFormaDePagoBonificacionContado()
        }
      }
      return this
    }

    def buildFormaDePagoDevolucionContado(){
        def formaDePago = this.rmd.venta.formaDePago
        comprobante.formaPago = getFormaDePago(formaDePago)
    }

    def buildFormaDePagoBonificacionContado() {
        NotaDeCreditoDet found = this.nota.partidas.max {NotaDeCreditoDet it -> it.cuentaPorCobrar.total}
        log.debug('Venta origen de mayor valor: {}', found.cuentaPorCobrar.folio);
        String formaDePago = found.cuentaPorCobrar.formaDePago
        comprobante.formaPago = getFormaDePago(formaDePago)
    }



    private getFormaDePago(String formaDePago) {
        switch (formaDePago) {
            case 'EFECTIVO':
            case 'DEPOSITO_EFECTIVO':
                return '01'
            case 'CHEQUE':
            case 'DEPOSITO_CHEQUE':
                return  '02'
            case 'TRANSFERENCIA':
                return '03'
            case 'TARJETA_CREDITO':
                return  '04'
            case 'TARJETA_DEBITO':
                return  '28'
            case 'BONIFICACION':
            case 'DEVOLUCION':
                return '17'
            case 'ANTICIPO':
                return '30'
            default:
                return '99'
        }

    }



    

    def buildConceptos() {
      if (this.nota.tipo.startsWith('DEV')) {
        buildConceptosDevolucion()
      } else if(this.nota.tipo == 'ANTICIPO') {
        buildConceptosAnticipo()
      } else {
        buildConceptosBonoificacion()
      }
    }

    def buildConceptosDevolucion(){
        /** Conceptos ***/

        this.totalImpuestosTrasladados = 0.0
        Comprobante.Conceptos conceptos = factory.createComprobanteConceptos()
        this.rmd.partidas.each { DevolucionDeVentaDet item ->
            log.info('RmdDet: {}', item.id)
            VentaDet det = item.ventaDet
            Comprobante.Conceptos.Concepto concepto = factory.createComprobanteConceptosConcepto()
            def factor = det.producto.unidad == 'MIL' ? 1000 : 1

            def importe = (item.cantidad/factor * det.precio)
            importe = MonedaUtils.round(importe)

            def descuento = (det.descuento / 100) * importe
            descuento = MonedaUtils.round(descuento)

            def subTot =  importe - descuento

            def impuesto = subTot * MonedaUtils.IVA
            impuesto = MonedaUtils.round(impuesto)
            log.debug("Importe: {}, Descuento: {} SubTotal: {}", importe, descuento, importe)
            // this.descuentoAcumulado = this.descuentoAcumulado + descuento
            if (descuento)
                concepto.descuento = descuento
            concepto.claveProdServ = '84111506'
            concepto.claveUnidad = 'ACT'
            concepto.noIdentificacion = det.producto.clave
            concepto.cantidad = MonedaUtils.round(item.cantidad / factor,3)
            concepto.unidad = det.producto.unidad
            concepto.descripcion = det.producto.descripcion
            concepto.valorUnitario = MonedaUtils.round(det.precio, 2)
            concepto.importe = importe
             /** TODO - Cambiar este dato esta en duro**/
            concepto.objetoImp = '02'
            concepto.impuestos = factory.createComprobanteConceptosConceptoImpuestos()
            concepto.impuestos.traslados = factory.createComprobanteConceptosConceptoImpuestosTraslados()

            Comprobante.Conceptos.Concepto.Impuestos.Traslados.Traslado traslado1
            traslado1 = factory.createComprobanteConceptosConceptoImpuestosTrasladosTraslado()
            traslado1.base =  subTot
            traslado1.impuesto = '002'
            traslado1.tipoFactor = CTipoFactor.TASA
            traslado1.tasaOCuota = 0.160000
            traslado1.importe = impuesto


            concepto.impuestos.traslados.traslado.add(traslado1)
            conceptos.concepto.add(concepto)

            // Acumulados
            this.baseTraslados +=  traslado1.base
            this.totalImpuestosTrasladados += traslado1.importe
            this.subTotalAcumulado = this.subTotalAcumulado + importe
            this.descuentoAcumulado = this.descuentoAcumulado + descuento

        }
        comprobante.conceptos = conceptos
        return this
    }

    def buildConceptosBonoificacion(){
        /** Conceptos ***/
        this.totalImpuestosTrasladados = 0.0
        Comprobante.Conceptos conceptos = factory.createComprobanteConceptos()

        this.nota.partidas.each { NotaDeCreditoDet item ->

            Comprobante.Conceptos.Concepto concepto = factory.createComprobanteConceptosConcepto()

            def importe = item.importe // MonedaUtils.calcularImporteDelTotal(item.importe)

            def impuesto = importe * MonedaUtils.IVA
            impuesto = MonedaUtils.round(impuesto)

            concepto.claveProdServ = '84111506'
            concepto.claveUnidad = 'ACT'
            concepto.noIdentificacion = 'BONIFICACION'
            concepto.cantidad = 1
            concepto.unidad = 'ACT'
            concepto.descripcion = "Bonificación de: ${item.tipoDeDocumento} - ${item.documento}"
            concepto.valorUnitario = importe
            concepto.importe = importe
            /** TODO - Cambiar este dato esta en duro**/
            concepto.objetoImp = '02'
            concepto.impuestos = factory.createComprobanteConceptosConceptoImpuestos()
            concepto.impuestos.traslados = factory.createComprobanteConceptosConceptoImpuestosTraslados()

            Comprobante.Conceptos.Concepto.Impuestos.Traslados.Traslado traslado1
            traslado1 = factory.createComprobanteConceptosConceptoImpuestosTrasladosTraslado()
            traslado1.base =  importe
            traslado1.impuesto = '002'
            traslado1.tipoFactor = CTipoFactor.TASA
            traslado1.tasaOCuota = 0.160000
            traslado1.importe = impuesto


            concepto.impuestos.traslados.traslado.add(traslado1)
            conceptos.concepto.add(concepto)

            println '*****************************'
            println 'UNO'
            println "Base traslados: "+ this.baseTraslados
            println "totalImpuestosTrasladados: "+ this.totalImpuestosTrasladados
            println "totalImpuestosTrasladados: "+ this.totalImpuestosTrasladados
            println '*****************************'

            // Acumulados
            this.baseTraslados += traslado1.base
            this.totalImpuestosTrasladados += traslado1.importe
            this.subTotalAcumulado = this.subTotalAcumulado + importe
            this.descuentoAcumulado = 0

            println '*****************************'
            println 'DOS'
            println "Base traslados: "+ this.baseTraslados
            println "totalImpuestosTrasladados: "+ this.totalImpuestosTrasladados
            println "totalImpuestosTrasladados: "+ this.totalImpuestosTrasladados
            println '*****************************'

        }

        comprobante.conceptos = conceptos
        return this
    }

    def buildConceptosAnticipo(){
      log.debug('Generando conceptos para ANTICIPO')
      this.totalImpuestosTrasladados = 0.0
      Comprobante.Conceptos conceptos = factory.createComprobanteConceptos()

      Comprobante.Conceptos.Concepto concepto = factory.createComprobanteConceptosConcepto()
      NotaDeCreditoDet item = this.nota.partidas[0]
      def importe = item.importe // MonedaUtils.calcularImporteDelTotal(item.importe)
      def impuesto = importe * MonedaUtils.IVA
      impuesto = MonedaUtils.round(impuesto)
      concepto.claveProdServ = '84111506'
      concepto.claveUnidad = 'ACT'
      concepto.noIdentificacion = 'ANTICIPO_APL'
      concepto.cantidad = 1
      concepto.unidad = 'ACT'
      concepto.descripcion = "Bonificación de: ${item.tipoDeDocumento} - ${item.documento}"
      concepto.valorUnitario = importe
       /** TODO - Cambiar este dato esta en duro**/
      concepto.objetoImp = '02'
      concepto.importe = importe
      concepto.impuestos = factory.createComprobanteConceptosConceptoImpuestos()
      concepto.impuestos.traslados = factory.createComprobanteConceptosConceptoImpuestosTraslados()
      Comprobante.Conceptos.Concepto.Impuestos.Traslados.Traslado traslado1
      traslado1 = factory.createComprobanteConceptosConceptoImpuestosTrasladosTraslado()
      traslado1.base =  importe
      traslado1.impuesto = '002'
      traslado1.tipoFactor = CTipoFactor.TASA
      traslado1.tasaOCuota = 0.160000
      traslado1.importe = impuesto

      concepto.impuestos.traslados.traslado.add(traslado1)
      conceptos.concepto.add(concepto)
       

      // Acumulados
      this.baseTraslados +=  traslado1.base
      this.totalImpuestosTrasladados += traslado1.importe
      this.totalImpuestosTrasladados = this.subTotalAcumulado + importe
      this.descuentoAcumulado = 0

      comprobante.conceptos = conceptos

      println '*****************************'
      println 'DOS'
      println "Base traslados: "+ this.baseTraslados
      println "totalImpuestosTrasladados: "+ this.totalImpuestosTrasladados
      println "totalImpuestosTrasladados: "+ this.totalImpuestosTrasladados
      println '*****************************'

      return this
    }

    def buildImpuestos(){
        Comprobante.Impuestos impuestos = factory.createComprobanteImpuestos()
        impuestos.setTotalImpuestosTrasladados(MonedaUtils.round(this.totalImpuestosTrasladados))
        Comprobante.Impuestos.Traslados traslados = factory.createComprobanteImpuestosTraslados()
        Comprobante.Impuestos.Traslados.Traslado traslado = factory.createComprobanteImpuestosTrasladosTraslado()
        traslado.impuesto = '002'
        traslado.tipoFactor = CTipoFactor.TASA
        traslado.tasaOCuota = 0.160000

        traslado.importe = MonedaUtils.round(this.totalImpuestosTrasladados)
        traslado.base = this.baseTraslados
        traslados.traslado.add(traslado)
        impuestos.traslados = traslados
        comprobante.setImpuestos(impuestos)
        return this
    }

   

    def buildTotales(){
        if(this.descuentoAcumulado > 0) {
            comprobante.descuento = this.descuentoAcumulado
        }
        comprobante.subTotal = this.subTotalAcumulado
        comprobante.total = comprobante.subTotal - this.descuentoAcumulado + this.totalImpuestosTrasladados

        return this
    }

    def buildRelacionados() {
      if(nota.tipo == 'ANTICIPO')
        return buildRelacionadoAnticipo()

        Comprobante.CfdiRelacionados relacionados = factory.createComprobanteCfdiRelacionados()
        relacionados.tipoRelacion = '01'
        if (this.rmd) {
            relacionados.tipoRelacion = '03'
            Comprobante.CfdiRelacionados.CfdiRelacionado relacionado = factory.createComprobanteCfdiRelacionadosCfdiRelacionado()
            assert rmd.venta.cuentaPorCobrar, 'RMD sin CxC timbrada'
            def cxc = rmd.venta.cuentaPorCobrar
            def uuid = cxc.uuid
            if(uuid == null) {
                if (cxc.cfdi) {
                    uuid = cxc.cfdi.uuid
                }
            }
            assert uuid, "Cuenta por cobrar ${cxc.tipoDocumento} - ${cxc.documento} sin UUID"
            relacionado.UUID = uuid
            relacionados.cfdiRelacionado.add(relacionado)

        } else {
            relacionados.tipoRelacion = '01'
            this.nota.partidas.each { NotaDeCreditoDet det ->

                Comprobante.CfdiRelacionados.CfdiRelacionado relacionado = factory.createComprobanteCfdiRelacionadosCfdiRelacionado()
                def cxc = det.cuentaPorCobrar
                def uuid = cxc.cfdi.uuid
                assert uuid, 'No existe UUID origen para la cxc :' + cxc.id
                relacionado.UUID = uuid
                relacionados.cfdiRelacionado.add(relacionado)
            }
        }
        comprobante.cfdiRelacionados = relacionados
    }

    def buildRelacionadoAnticipo() {
        Comprobante.CfdiRelacionados relacionados = factory.createComprobanteCfdiRelacionados()
        relacionados.tipoRelacion = '07'
        NotaDeCreditoDet det = nota.partidas[0]
        Comprobante.CfdiRelacionados.CfdiRelacionado relacionado = factory.createComprobanteCfdiRelacionadosCfdiRelacionado()

        def uuid = det.uuid
        if(uuid == null)
          throw new RuntimeException('NO EXISTE EL UUID  para la apliacion de anticipo')
        relacionado.UUID = uuid
        relacionados.cfdiRelacionado.add(relacionado)
        comprobante.cfdiRelacionados = relacionados
    }

    def buildCertificado(){
        comprobante.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        comprobante.setCertificado(new String(encodedCert))
        return this

    } 
}
