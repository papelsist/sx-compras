 package com.cfdi4

import groovy.util.logging.Slf4j

import org.bouncycastle.util.encoders.Base64

import com.cfdi4.Cfdi4Utils
import com.cfdi4.catalogos.CMetodoPago
import com.cfdi4.catalogos.CTipoDeComprobante
import com.cfdi4.catalogos.CTipoFactor
import com.cfdi4.catalogos.CUsoCFDI
import com.cfdi4.catalogos.CMoneda
import com.cfdi4.comprobante.Comprobante
import com.cfdi4.comprobante.Pagos
import com.cfdi4.comprobante.ObjectFactory
import sx.cfdi.DateUtils
import sx.cfdi.Cfdi
import sx.core.Folio
import sx.cxc.AplicacionDeCobro
import sx.cxc.Cobro
import sx.core.Empresa
import sx.cxc.CobroCheque
import sx.cxc.CobroTransferencia
import sx.cxc.SolicitudDeDeposito
import sx.utils.MonedaUtils


@Slf4j
class Cfdi4PagoBuilder {

    private factory = new ObjectFactory();
    private Comprobante comprobante;
    private Empresa empresa

    private Cobro cobro

    CfdiSellador4 cfdiSellador4 

        def build(Cobro cobro){
        this.cobro = cobro
        this.empresa = Empresa.first()
        buildComprobante()
        .buildEmisor()
        .buildReceptor()
        .buildConceptos()
        .buildCertificado()
        .buildRelacionados()
        .buildComplementoPago()
        comprobante = cfdiSellador4.sellar(comprobante, empresa)

        return comprobante
    }
    def buildComprobante(){
        log.info("Generando Recibo de pago CFDI 4.0 para Cobro {} {} - {} ", cobro.tipo)
        this.comprobante = factory.createComprobante()
        comprobante.version = "4.0"
        comprobante.tipoDeComprobante = CTipoDeComprobante.P
        String serie = "PAG${cobro.tipo}"
        comprobante.serie = serie
        comprobante.folio = Folio.nextFolio('CFDI',serie)
        comprobante.setFecha(DateUtils.getCfdiDate(new Date()))
        comprobante.moneda =  'XXX'
        comprobante.subTotal = 0
        comprobante.total = 0
        comprobante.exportacion = "01"
        comprobante.lugarExpedicion = empresa.direccion.codigoPostal
        return this
    }

    def buildEmisor(){
        Comprobante.Emisor emisor = factory.createComprobanteEmisor()
        emisor.rfc = empresa.rfc
        emisor.nombre = 'PAPEL'
        emisor.regimenFiscal = empresa.regimenClaveSat ?:'601'
        comprobante.emisor = emisor
        return this
    }

    def buildReceptor(){
        Comprobante.Receptor receptor = factory.createComprobanteReceptor()
        receptor.rfc = cobro.cliente.rfc
        receptor.nombre = cobro.cliente.razon_social
        receptor.domicilioFiscalReceptor = cobro.cliente.direccion.codigoPostal
        receptor.usoCFDI = CUsoCFDI.CP_01
        receptor.regimenFiscalReceptor= cobro.cliente.regimen_fiscal
        comprobante.receptor = receptor
        return this
    }



    def buildConceptos(){
        Comprobante.Conceptos conceptos = factory.createComprobanteConceptos()
        Comprobante.Conceptos.Concepto concepto = factory.createComprobanteConceptosConcepto()
        concepto.claveProdServ = '84111506'
        concepto.cantidad = 1
        concepto.claveUnidad = 'ACT'
        concepto.descripcion = 'Pago'
        concepto.valorUnitario = 0
        concepto.importe = 0
        concepto.objetoImp = "01"
        conceptos.concepto.add(concepto)
        comprobante.conceptos = conceptos
        return this
    }

    def buildRelacionados() {
      if(this.cobro.cancelacionDeCfdi) {
        def cancelacion = this.cobro.cancelacionDeCfdi
        if(cancelacion.status != 'Cancelado') {
          throw new RuntimeException("El CFDI ${cancelacion.uuid} aun no tiene estatus de cancelado en el SAT Estatus actual: ${cancelacion.status}")
        }
        Comprobante.CfdiRelacionados relacionados = factory.createComprobanteCfdiRelacionados()

        relacionados.tipoRelacion = '04'
        Comprobante.CfdiRelacionados.CfdiRelacionado relacionado = factory.createComprobanteCfdiRelacionadosCfdiRelacionado()
        relacionado.UUID = this.cobro.cancelacionDeCfdi.uuid
        relacionados.cfdiRelacionado.add(relacionado)

        comprobante.cfdiRelacionados = relacionados
      }
      return this
    }

    def buildCertificado(){
        comprobante.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        comprobante.setCertificado(new String(encodedCert))
        return this
    }

    def getFechaDePago(Cobro c){
         def fechaPago = c.fecha
         def sol = SolicitudDeDeposito.where{cobro == c}.find()
         if(sol){
             fechaPago = sol.fechaDeposito
         }

         return  DateUtils.getCfdiDate(fechaPago)
    }

    def getFormaDePago(){
        switch (this.cobro.formaDePago) {
            case 'EFECTIVO':
            case 'DEPOSITO_EFECTIVO':
                return '01'
            case 'CHEQUE':
            case 'DEPOSITO_CHEQUE':
                return '02'
            case 'TRANSFERENCIA':
                return '03'
            case 'TARJETA_CREDITO':
                return '04'
            case 'TARJETA_DEBITO':
                return '28'
            case 'BONIFICACION':
            case 'DEVOLUCION':
                return '17'
            default:
                return '99'
        }

    }

    def buildComplementoPago() {
        BigDecimal totalPagos =0.0
        BigDecimal totalBaseIva16 = 0.0
        BigDecimal baseDrAcumulado = 0.0
        BigDecimal importeDrAcumulado = 0.0 
        Comprobante.Complemento complemento = factory.createComprobanteComplemento()

        Pagos pagos = factory.createPagos()
        pagos.version = '2.0'

        /** Totales */

        Pagos.Totales totales = factory.createPagosTotales()
       

        Pagos.Pago pago = factory.createPagosPago()
        pago.fechaPago = getFechaDePago(this.cobro)
        pago.formaDePagoP = getFormaDePago()
        pago.tipoCambioP = 1
        pago.monedaP = cobro.moneda.currencyCode
        if(this.cobro.moneda.currencyCode != 'MXN') {
            pago.tipoCambioP = cobro.tipoDeCambio
        }
        List<AplicacionDeCobro> aplicaciones = this.cobro.aplicaciones.findAll{it.recibo == null}

        BigDecimal monto = this.cobro.importe 
        pago.monto = monto
         pago.numOperacion = this.cobro.referencia
        if(this.cobro.cheque) {
            CobroCheque cheque = this.cobro.cheque
            pago.numOperacion = cheque.numero.toString()
        } else if(this.cobro.transferencia) {
            CobroTransferencia transferencia = this.cobro.transferencia
        }
        log.info('Recibo de pago por: {}', pago.monto)
        def sumaImpPagado = 0

        aplicaciones.each{ AplicacionDeCobro aplicacion ->

            totalPagos += aplicacion.importe 
            totalBaseIva16 += MonedaUtils.round((aplicacion.importe / 1.16),2)
            /** Documento relacionado  */ 
            Pagos.Pago.DoctoRelacionado relacionado = factory.createPagosPagoDoctoRelacionado()
            def cxc = aplicacion.cuentaPorCobrar
            Cfdi cfdi = cxc.cfdi
            if(!cfdi) {
                throw new RuntimeException("La cuenta por cobrar ${cxc.tipo} ${cxc.documento} no tiene CFDI")
            }
            relacionado.idDocumento = cfdi.uuid
            relacionado.folio = cxc.documento
            relacionado.serie = cxc.cfdi.serie
            relacionado.monedaDR = cxc.moneda.currencyCode
            relacionado.equivalenciaDR = 1
            if(this.cobro.moneda.currencyCode != cxc.moneda.currencyCode) {
                relacionado.equivalenciaDR = MonedaUtils.round(1 / aplicacion.tipoDeCambio, 6)
            }
            relacionado.numParcialidad = 1

            BigDecimal saldoAnterior = cxc.total

            def pagosAplicados = AplicacionDeCobro.findAll("""
                select sum(a.importe) from AplicacionDeCobro a
                  where a.cuentaPorCobrar.id = :cxcId
                    and a.cobro.cfdi != null
                    and a.cobro.formaDePago not in ('DEVOLUCION','BONIFICACION')
                    """,
                [cxcId: cxc.id])[0] ?: 0.0

            def notasAplicadas = AplicacionDeCobro.findAll("""
                select sum(a.importe) from AplicacionDeCobro a
                  where a.cuentaPorCobrar.id = :cxcId
                    and a.cobro.formaDePago in ('DEVOLUCION','BONIFICACION')
                """,
                [cxcId: cxc.id])[0] ?: 0.0


            // def aplicacionesAnteriores = aplicacionesDePagos + aplicacionesDePagos
            def pagosAnteriores = MonedaUtils.round(pagosAplicados + notasAplicadas, 2)

            if(pagosAnteriores > 0) {
                saldoAnterior = cxc.total - pagosAnteriores
            }

            relacionado.impSaldoAnt = MonedaUtils.round(saldoAnterior, 2)
            relacionado.impPagado = MonedaUtils.round(aplicacion.importe, 2)


            if(relacionado.equivalenciaDR) {
                // relacionado.impSaldoAnt = MonedaUtils.round(saldoAnterior * relacionado.tipoCambioDR, 2)
                // relacionado.impPagado = MonedaUtils.round(aplicacion.importe * relacionado.tipoCambioDR, 2)
            }

            relacionado.impSaldoInsoluto = relacionado.impSaldoAnt - relacionado.impPagado

            relacionado.objetoImpDR =  "02"

           if(this.cobro.moneda.currencyCode != cxc.moneda.currencyCode) {
                log.debug('Pagos anteriores: {} Descuentos: {}', pagosAplicados, notasAplicadas)
                log.debug("Fac: ${cxc.documento} Total: ${cxc.total} Saldo anterior: ${saldoAnterior } Pago aplicado: ${relacionado.impPagado} Saldo Insoluto: ${relacionado.impSaldoInsoluto} MonedaDR: ${relacionado.monedaDR} TC: ${relacionado.tipoCambioDR}")
                log.debug('Importe convertido: {}', MonedaUtils.round( (aplicacion.importe * relacionado.tipoCambioDR), 2 ))
            } 

            if(relacionado.objetoImpDR == "02"){
                Pagos.Pago.DoctoRelacionado.ImpuestosDR impuestosDR = factory.createPagosPagoDoctoRelacionadoImpuestosDR()
                Pagos.Pago.DoctoRelacionado.ImpuestosDR.TrasladosDR trasladosDR = factory.createPagosPagoDoctoRelacionadoImpuestosDRTrasladosDR()
                Pagos.Pago.DoctoRelacionado.ImpuestosDR.TrasladosDR.TrasladoDR trasladoDR = factory.createPagosPagoDoctoRelacionadoImpuestosDRTrasladosDRTrasladoDR()
                trasladoDR.baseDR= MonedaUtils.round((aplicacion.importe / 1.16),2)
                trasladoDR.impuestoDR = '002'
                trasladoDR.tipoFactorDR = CTipoFactor.TASA
                trasladoDR.tasaOCuotaDR = 0.160000 
                trasladoDR.importeDR =  aplicacion.importe - MonedaUtils.round((aplicacion.importe / 1.16),2)
                trasladosDR.trasladoDR.add(trasladoDR)
                impuestosDR.trasladosDR = trasladosDR 
                relacionado.impuestosDR = impuestosDR 

                baseDrAcumulado += trasladoDR.baseDR
                importeDrAcumulado += trasladoDR.importeDR
                /*
                println "*********************************************"
                println "BaseDR: ${baseDrAcumulado} -- ${trasladoDR.baseDR}"
                println "ImporteDR: ${importeDrAcumulado} -- ${trasladoDR.importeDR}"
                println "*********************************************"
                */

            }

            pago.doctoRelacionado.add(relacionado)
        }
        /** Build Impuestos Pago */
        Pagos.Pago.ImpuestosP impuestosP = factory.createPagosPagoImpuestosP()  
        Pagos.Pago.ImpuestosP.TrasladosP trasladosP =  factory.createPagosPagoImpuestosPTrasladosP()
        Pagos.Pago.ImpuestosP.TrasladosP.TrasladoP trasladoP = factory.createPagosPagoImpuestosPTrasladosPTrasladoP()
        trasladoP.baseP = baseDrAcumulado // MonedaUtils.round(totalBaseIva16,2)
        trasladoP.impuestoP = "002"
        trasladoP.importeP = importeDrAcumulado // totalPagos - MonedaUtils.round(totalBaseIva16,2)
        trasladoP.tipoFactorP = CTipoFactor.TASA
        trasladoP.tasaOCuotaP = 0.160000 
        trasladosP.trasladoP.add(trasladoP)
        impuestosP.trasladosP = trasladosP 
        pago.impuestosP=impuestosP
        /** Totales Pago*/
        totales.totalTrasladosBaseIVA16 = MonedaUtils.round(totalBaseIva16,2)
        totales.totalTrasladosImpuestoIVA16 = totalPagos - MonedaUtils.round(totalBaseIva16,2)
        totales.montoTotalPagos = totalPagos
        pagos.totales = totales

        pagos.pago.add(pago)
        complemento.any.add(pagos) 
        comprobante.complemento = complemento

    }
}