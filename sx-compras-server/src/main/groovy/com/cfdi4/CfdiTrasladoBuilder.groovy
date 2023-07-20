package com.cfdi4

import groovy.util.logging.Slf4j
import com.cfdi4.comprobante.ObjectFactory
import com.cfdi4.comprobante.Comprobante
import com.cfdi4.catalogos.CTipoDeComprobante
import com.cfdi4.catalogos.CMoneda
import com.cfdi4.catalogos.CUsoCFDI
import com.cfdi4.catalogos.CTipoFactor
// import org.apache.commons.logging.LogFactory
import org.bouncycastle.util.encoders.Base64
import sx.core.Empresa
import sx.inventario.Traslado
import sx.inventario.TrasladoDet


// Catalogos
import sx.utils.MonedaUtils

//
/**
 * TODO: Parametrizar el regimenFiscal de
 */
@Slf4j
class CfdiTrasladoBuilder {


    // private static final log=LogFactory.getLog(this)

    CfdiSellador4 cfdiSellador4 

    private factory = new ObjectFactory();
    private Comprobante comprobante;
    private Empresa empresa

    private Traslado tps

    private BigDecimal subTotal = 0.0
    private BigDecimal totalImpuestosTrasladados


     def build(Traslado tps){

        this.tps = tps
        this.empresa = Empresa.first()
        // assert empresa, 'La empresa no esta registrada...'
        buildComprobante()
                .buildFormaDePago()
                .buildEmisor()
                .buildReceptor()
                .buildConceptos()
                //.buildImpuestos()
                .buildTotales()
                .buildCertificado() 
        comprobante = cfdiSellador4.sellar(comprobante, empresa)
        return comprobante
    }
 

    def buildComprobante(){
        log.info("Generando CFDI 4.0 para {} - {} ",this.tps.tipo, this.tps.documento)
        this.comprobante = factory.createComprobante()
        comprobante.version = "4.0"
        comprobante.tipoDeComprobante = CTipoDeComprobante.T
        comprobante.serie = "${tps.sucursal.nombre.substring(0,2)}_TPS"
        comprobante.folio = tps.documento.toString()
        comprobante.setFecha(DateUtils.getCfdiDate(new Date()))
        comprobante.moneda =  CMoneda.MXN
        comprobante.exportacion = '01'
        comprobante.lugarExpedicion = tps.sucursal.direccion.codigoPostal
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
        receptor.rfc = 'XAXX010101000'
        receptor.nombre = 'PUBLICO EN GENERAL'
        receptor.usoCFDI = CUsoCFDI.P_01
        receptor.domicilioFiscalReceptor = tps.sucursal.direccion.codigoPostal
        receptor.regimenFiscalReceptor = '616'
        comprobante.receptor = receptor
        
        return this
    } 

    /**
     *  FIX Para CRE, CON y COD
     */
     def buildFormaDePago(){
        // comprobante.formaPago = '99'
        // comprobante.metodoPago = CMetodoPago.PPD
        return this
    } 

    def buildConceptos(){
        
        this.totalImpuestosTrasladados = 0.0
        Comprobante.Conceptos conceptos = factory.createComprobanteConceptos()
        this.tps.partidas.each { TrasladoDet det ->

            Comprobante.Conceptos.Concepto concepto = factory.createComprobanteConceptosConcepto()
            concepto.with {
                assert det.producto.productoSat,
                        "No hay una claveProdServ definida para el producto ${det.producto} SE REQUIERE PARA EL CFDI 4.0"
                assert det.producto.unidadSat.claveUnidadSat,
                        "No hay una claveUnidadSat definida para el producto ${det.producto} SE REQUIERE PARA EL CFDI 4.0"
                def factor = det.producto.unidad == 'MIL' ? 1000 : 1
                String desc = det.producto.descripcion
                claveProdServ = det.producto.productoSat.claveProdServ
                noIdentificacion = det.producto.clave
                cantidad = MonedaUtils.round(det.cantidad.abs() / factor,3)
                claveUnidad = det.producto.unidadSat.claveUnidadSat
                unidad = det.producto.unidad
                descripcion = 'Traslado de mercancias ' + desc
                valorUnitario = MonedaUtils.round(0, 2)
                importe = MonedaUtils.round(0, 2)
                objetoImp = '01'

                conceptos.concepto.add(concepto)
                comprobante.conceptos = conceptos
            }
        }
        return this
    }
 
    def buildImpuestos(){
        /** Impuestos **/
        
        Comprobante.Impuestos impuestos = factory.createComprobanteImpuestos()
        impuestos.setTotalImpuestosTrasladados(this.totalImpuestosTrasladados)
        Comprobante.Impuestos.Traslados traslados = factory.createComprobanteImpuestosTraslados()
        Comprobante.Impuestos.Traslados.Traslado traslado = factory.createComprobanteImpuestosTrasladosTraslado()
        traslado.impuesto = '002'
        traslado.tipoFactor = CTipoFactor.TASA
        traslado.tasaOCuota = 0.160000
        traslado.base = 0.0000
        //traslado.importe = venta.impuestos
        traslado.importe = this.totalImpuestosTrasladados
        traslados.traslado.add(traslado)
        impuestos.traslados = traslados
        comprobante.setImpuestos(impuestos)
        
        return this
    }

    def buildTotales(){
        comprobante.subTotal = 0.0 //.setScale(2, RoundingMode.CEILING)
        comprobante.total = 0.0

        return this
    }
 
    def buildCertificado(){
        comprobante.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        comprobante.setCertificado(new String(encodedCert))
        return this

    } 

    Comprobante getComprobante(){
        return this.comprobante
    } 

}
