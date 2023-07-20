package sx.cfdi.v33


import groovy.util.logging.Slf4j


import org.bouncycastle.util.encoders.Base64
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import lx.cfdi.utils.DateUtils
import lx.cfdi.v33.*

import sx.core.Empresa
import sx.cxc.NotaDeCargo
import sx.cxc.NotaDeCargoDet
import sx.utils.MonedaUtils

@Slf4j
@Component
class NotaDeCargoBuilder {

    private factory = new ObjectFactory()
    private Comprobante comprobante
    private Empresa empresa

    private NotaDeCargo nota

    private BigDecimal subTotalAcumulado = 0.0
    private BigDecimal descuentoAcumulado = 0.0
    private BigDecimal totalImpuestosTrasladados = 0.0

    @Autowired
    @Qualifier('cfdiSellador33')
    CfdiSellador33 cfdiSellador33

    def build(NotaDeCargo nota){
        this.nota = nota
        this.empresa = Empresa.first()
        subTotalAcumulado = 0.0
        descuentoAcumulado = 0.0
        buildComprobante()
        .buildEmisor()
        .buildReceptor()
        .buildFormaDePago()
        .buildConceptos()
        .buildImpuestos()
        .buildTotales()
        .buildCertificado()
        .buildRelacionados()
        comprobante = cfdiSellador33.sellar(comprobante, empresa)
        // CfdiUtils.serialize(comprobante)
        return comprobante
    }

    def buildComprobante(){
        log.info("Generando CFDI 3.3 para Nota de cargo {} {} - {} ", nota.tipo, nota.serie, nota.folio)
        this.comprobante = factory.createComprobante()
        comprobante.version = "3.3"
        comprobante.tipoDeComprobante = CTipoDeComprobante.I
        comprobante.serie = nota.serie
        comprobante.folio = nota.folio.toString()
        comprobante.setFecha(DateUtils.getCfdiDate(new Date()))
        comprobante.moneda =  V33CfdiUtils.getMonedaCode(nota.moneda)
        if(nota.moneda != MonedaUtils.PESOS){
            comprobante.tipoCambio = nota.tipoDeCambio
        }
        comprobante.lugarExpedicion = empresa.direccion.codigoPostal
        return this
    }

    def buildEmisor(){
        Comprobante.Emisor emisor = factory.createComprobanteEmisor()
        emisor.rfc = empresa.rfc
        emisor.nombre = empresa.nombre
        emisor.regimenFiscal = empresa.regimenClaveSat ?:'601'
        comprobante.emisor = emisor
        return this
    }

    def buildReceptor(){
        Comprobante.Receptor receptor = factory.createComprobanteReceptor()
        receptor.rfc = nota.cliente.rfc
        receptor.nombre = nota.cliente.nombre
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
            case 'COMPENSACION':
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
            traslado1.tasaOCuota = '0.160000'
            traslado1.importe = impuesto

            concepto.impuestos.traslados.traslado.add(traslado1)
            conceptos.concepto.add(concepto)

            // Acumulados
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
        traslado.tasaOCuota = '0.160000'

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
        if(nota.tipo != 'CHE' &&  nota.tipo != 'CHO') {
            Comprobante.CfdiRelacionados relacionados = factory.createComprobanteCfdiRelacionados()
            relacionados.tipoRelacion = '02'
            this.nota.partidas.each { NotaDeCargoDet det ->
                Comprobante.CfdiRelacionados.CfdiRelacionado relacionado = factory.createComprobanteCfdiRelacionadosCfdiRelacionado()
                def cxc = det.cuentaPorCobrar
                def uuid = cxc.uuid
                assert uuid, 'No existe UUID origen para la cxc :' + cxc.id
                relacionado.UUID = uuid
                relacionados.cfdiRelacionado.add(relacionado)
            }
            comprobante.cfdiRelacionados = relacionados
        }

    }

    def buildCertificado(){
        comprobante.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        comprobante.setCertificado(new String(encodedCert))
        return this
    }
}
