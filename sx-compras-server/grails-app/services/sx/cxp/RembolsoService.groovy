package sx.cxp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.core.Cliente
import sx.core.LogUser
import sx.core.Sucursal
import sx.cxc.Cobro
import sx.cxc.CuentaPorCobrar
import sx.tesoreria.MovimientoDeCuenta

@Transactional
@Slf4j
class RembolsoService implements  LogUser{

    def delete(Rembolso rembolso) {

    }

    /**
     *  Genera los pagos correspondientes junto con sus aplicaciones para atender las cuentas por pagar
     *
     * @param rembolso
     * @return
     */
    def registrarPago(Rembolso rembolso) {
        log.info('Generando pagos para rembolso {}', rembolso)
        rembolso.partidas.each { det ->
            CuentaPorPagar cxp = det.cxp
            Pago pago = generarPago(cxp, rembolso.egreso, det.apagar)
            if(pago) {
                rembolso.pago = pago
                log.info('Pago Generado: {}', pago)
                pago.sw2 = det.id
                if(!pago.createUser) {
                    pago.createUser = 'admin'
                    pago.updateUser = 'admin'
                }
                rembolso.save failOnError: true, flush: true
                // pago.save failOnError: true
            }
        }
    }


    /**
     * Genera los Cobros a partir de un pago de fletes. Estos cobros son para se usados como
     * forma de pago por COMPENSACION em las cuentas por pagar de los Proveedores de flete
     *
     */
    def generarCobrosDeFlete(Rembolso rembolso) {
        if(!rembolso.egreso) {
            // throw new RuntimeException("El rembolso ${rembolso.id} no esta PAGADO")
        }
        if(rembolso.cuentaContable && rembolso.cuentaContable.clave.startsWith('205-0004')) {
            log.info('Procesando: ', rembolso)
            rembolso.partidas.each { det ->
                CuentaPorPagar cxp = det.cxp
                if(cxp) {
                    BigDecimal diff = cxp.total - det.apagar
                    if(diff > 0.0 ) {
                        Cobro cobro = Cobro.where{sw2 == det.id}.find()
                        if(!cobro)
                            cobro = generarCobro(cxp, diff)
                        logEntity(cobro)


                    }
                }

            }
        }
    }

    /**
     * PENDIENTE
     * @param rembolso
     * @return
     */
    def registrarNotaDeCompensacion(Rembolso rembolso) {
        if(rembolso.pago == null && rembolso.egreso) {
            log.info('Generando pagos para rembolso {}', rembolso)
            rembolso.partidas.each { det ->
                CuentaPorPagar cxp = det.cxp
                BigDecimal diff = cxp.total - det.apagar
                NotaDeCreditoCxP nota = generarPago(cxp, rembolso.egreso, diff)
                if(nota) {
                    nota.sw2 = det.id
                    if(!pago.createUser) {
                        pago.createUser = 'admin'
                        pago.updateUser = 'admin'
                    }
                    pago.save failOnError: true
                }
            }
        }
    }

    private Cobro generarCobro(CuentaPorPagar cxp, BigDecimal dif) {
        ComprobanteFiscal cfdi = cxp.comprobanteFiscal

        Cobro cobro = new Cobro()
        cobro.importe = dif
        cobro.sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        cobro.tipo = 'CHO'
        cobro.referencia = "${cfdi.serie ?: ''}  ${cfdi.folio?: ''}"
        cobro.cliente = Cliente.where{rfc == cfdi.emisorRfc}.find()
        cobro.fecha = new Date()
        cobro.comentario = 'FLETES'
        cobro.formaDePago = 'COMPENSACION'
        return cobro
    }

    private Pago generarPago(CuentaPorPagar cxp, MovimientoDeCuenta egreso, BigDecimal importe, String comentario = 'PAGO_DE_GASTOS') {
        if(cxp.saldoReal > 0.0) {
            Pago pago = new Pago()
            pago.fecha = egreso.fecha
            pago.formaDePago = egreso.formaDePago
            pago.proveedor = cxp.proveedor
            pago.nombre = cxp.nombre
            pago.total = importe.abs()
            pago.folio = cxp.folio
            pago.serie = cxp.serie
            pago.egreso = egreso
            pago.comentario = comentario
            AplicacionDePago a = new AplicacionDePago()
            a.cxp = cxp
            a.fecha = egreso.fecha
            a.comentario = comentario
            a.importe = importe.abs()
            pago.addToAplicaciones(a)
            logEntity(pago)
            return pago
        }
        return null
    }

    def aplicarPago(Rembolso rembolso) {
        if(rembolso.pago && rembolso.pago.disponible > 0) {
            def pago = rembolso.pago
            rembolso.partidas.each { RembolsoDet det ->
                def cxp = det.cxp
                BigDecimal importe = cxp.saldoReal <= pago.disponible ? cxp.saldoReal : pago.disponible
                if(importe ) {
                    log.info('Importe a aplicar: {}', importe)
                    
                    AplicacionDePago apl = new AplicacionDePago(
                            pago: pago,
                            fecha: rembolso.fechaDePago,
                            cxp: cxp,
                            importe: importe,
                            comentario: "Pago de Requisicion ${rembolso.id}",
                            formaDePago: rembolso.formaDePago
                    )
                    apl.save flush: true
                }
            }
            rembolso.save flush: true
            // pago.refresh()
            // logEntity(pago)
            // log.info("Pago {} aplicado disponible: {}", pago.folio, pago.disponible)

        }
        
        
    }
}
