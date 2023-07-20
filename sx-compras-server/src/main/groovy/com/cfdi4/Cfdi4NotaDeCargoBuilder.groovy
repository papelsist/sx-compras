package com.cfdi4

import groovy.util.logging.Slf4j
import com.cfdi4.Cfdi4Utils
import org.bouncycastle.util.encoders.Base64

import sx.cfdi.DateUtils
import com.cfdi4.catalogos.CMetodoPago
import com.cfdi4.catalogos.CTipoDeComprobante
import com.cfdi4.catalogos.CTipoFactor
import com.cfdi4.catalogos.CUsoCFDI
import com.cfdi4.comprobante.Comprobante
import com.cfdi4.comprobante.ObjectFactory
import sx.cxc.NotaDeCargoDet
import sx.utils.MonedaUtils
import sx.core.Empresa
import sx.core.VentaDet
import sx.cxc.NotaDeCargo


@Slf4j
class Cfdi4NotaDeCargoBuilder {

    private factory = new ObjectFactory();
    private Comprobante comprobante;
    private Empresa empresa

    private NotaDeCargo nota

    private BigDecimal subTotalAcumulado = 0.0
    private BigDecimal descuentoAcumulado = 0.0
    private BigDecimal totalImpuestosTrasladados = 0.0
    private BigDecimal baseTraslados = 0.0

    CfdiSellador4 cfdiSellador4 
   

    def build(NotaDeCargo nota){
        this.nota = nota
        this.empresa = Empresa.first()
        subTotalAcumulado = 0.0
        descuentoAcumulado = 0.0
        this.baseTraslados =  0.0
        this.totalImpuestosTrasladados = 0.0
        this.subTotalAcumulado = 0.0
        this.descuentoAcumulado = 0.0

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
        // CfdiUtils.serialize(comprobante)
        return comprobante
    }
    def buildComprobante(){
        log.info("Generando CFDI Version 4.0 para Nota de cargo {} {} - {} ", nota.tipo, nota.serie, nota.folio)
        this.comprobante = factory.createComprobante()
        comprobante.version = "4.0"
        comprobante.tipoDeComprobante = CTipoDeComprobante.I
        comprobante.serie = nota.serie
        comprobante.folio = nota.folio.toString()
        comprobante.setFecha(DateUtils.getCfdiDate(new Date()))
        comprobante.moneda =  V4CfdiUtils.getMonedaCode(nota.moneda)
        comprobante.exportacion = "01"
        if(nota.moneda != MonedaUtils.PESOS){
            comprobante.tipoCambio = nota.tipoDeCambio
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
        receptor.nombre = nota.cliente.razonSocial
        receptor.domicilioFiscalReceptor = nota.cliente.direccion.codigoPostal
        receptor.regimenFiscalReceptor = nota.cliente.regimenFiscal
        switch(nota.usoDeCfdi) {
            case 'G01':
                receptor.usoCFDI = CUsoCFDI.G_01
                break
            case 'G02':
                receptor.usoCFDI = CUsoCFDI.G_02
                break
            case 'G03':
                receptor.usoCFDI = CUsoCFDI.G_03
                break
            case 'P01':
                receptor.usoCFDI = CUsoCFDI.P_01
                break
            default:
                receptor.usoCFDI = CUsoCFDI.G_01
                break
        }
        comprobante.receptor = receptor
        return this
        comprobante.receptor = receptor
        return this
    }

    def buildFormaDePago(){
        comprobante.metodoPago = CMetodoPago.PUE
        switch (this.nota.formaDePago) {
            case 'EFECTIVO':
            case 'DEPOSITO_EFECTIVO':
                comprobante.formaPago = '01'
                break
            case 'CHEQUE':
            case 'DEPOSITO_CHEQUE':
                comprobante.formaPago = '02'
                break
            case 'TRANSFERENCIA':
                comprobante.formaPago = '03'
                break
            case 'TARJETA_CREDITO':
                comprobante.formaPago = '04'
                break
            case 'TARJETA_DEBITO':
                comprobante.formaPago = '28'
                break
            case 'BONIFICACION':
            case 'DEVOLUCION':
                comprobante.formaPago = '17'
                break
            default:
                comprobante.formaPago = '99'
                comprobante.metodoPago = CMetodoPago.PPD
        }
        return this
    }

    def buildConceptos(){
        /** Conceptos ***/
        String claveProdServ = '84101700'
        String noIdentificacion = 'CARGO'
        String claveUnidad = 'ACT'
        String unidad = 'ACT'
        String prefix = 'Intereses de fac: '

        if (nota.tipo == 'CHE') {
            claveProdServ = '84101704'
            prefix = 'Comisión por cheque devuelto'
        }

         if (nota.tipo == 'CHO') {
            claveProdServ = '84101700'
            noIdentificacion = 'CARGO'
            claveUnidad = 'ACT'
            unidad = 'ACT'
            prefix = 'INTERESES POR PRESTAMO PERSONAL '
        }

        this.totalImpuestosTrasladados = 0.0
        Comprobante.Conceptos conceptos = factory.createComprobanteConceptos()
        this.baseTraslados = 0.0
        this.nota.partidas.each { NotaDeCargoDet item ->

            Comprobante.Conceptos.Concepto concepto = factory.createComprobanteConceptosConcepto()
            def importe = item.importe

            def impuesto = importe * MonedaUtils.IVA
            impuesto = MonedaUtils.round(impuesto)

            concepto.claveProdServ = claveProdServ
            concepto.claveUnidad = claveUnidad
            concepto.noIdentificacion = noIdentificacion
            concepto.cantidad = 1
            concepto.unidad = unidad
            concepto.descripcion = "${prefix} ${nota.tipo} ${item.documento?: ''}  (${item.documentoFecha.format('dd/MM/yyyy')}) ${item.sucursal}"
            if(nota.tipo == 'CHO') {
                concepto.descripcion = nota.comentario
            }

            concepto.valorUnitario = importe
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
            /** TODO - Cambiar este dato esta en duro**/
            concepto.objetoImp = '02'
            concepto.impuestos.traslados.traslado.add(traslado1)
            conceptos.concepto.add(concepto)

            // Acumulados
            this.baseTraslados +=  traslado1.base
            this.totalImpuestosTrasladados += traslado1.importe
            this.subTotalAcumulado = this.subTotalAcumulado + importe
            this.descuentoAcumulado = 0

        }
        comprobante.conceptos = conceptos
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
        traslado.base = this.baseTraslados
        traslado.importe = MonedaUtils.round(this.totalImpuestosTrasladados)
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
        List relacionables = this.nota.partidas.findAll{it.cuentaPorCobrar != null}
        if(relacionables) {
            Comprobante.CfdiRelacionados relacionados = factory.createComprobanteCfdiRelacionados()
            relacionados.tipoRelacion = '02'
            relacionables.each { NotaDeCargoDet det ->
                Comprobante.CfdiRelacionados.CfdiRelacionado relacionado = factory.createComprobanteCfdiRelacionadosCfdiRelacionado()
                def cxc = det.cuentaPorCobrar
                def uuid = cxc.uuid
                if(uuid == null && cxc.cfdi) {
                  uuid = cxc.cfdi.uuid
                }
                assert uuid, 'No existe UUID origen para la cxc :' + cxc.id
                relacionado.UUID = uuid
                relacionados.cfdiRelacionado.add(relacionado)
            }
            comprobante.cfdiRelacionados = relacionados
        }
        /*
        if(nota.tipo != 'CHE') {

        }
        */

    }

    def buildCertificado(){
        comprobante.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        comprobante.setCertificado(new String(encodedCert))
        return this
    }
}
