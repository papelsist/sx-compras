package sx.contabilidad.ingresos


import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.CuentaOperativaCliente
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.cxc.AplicacionDeCobro
import sx.cxc.Cobro
import sx.utils.MonedaUtils

@Slf4j
@Component
class CobranzaPagosDiffTask implements  AsientoBuilder{


    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para cobranza con SALDOS A FAVOR {} {}", poliza.sucursal, poliza.fecha)
        String tipo = params.tipo

        List<AplicacionDeCobro> aplicaciones = findAplicaciones(poliza.fecha, tipo).findAll {it.importe.abs() > 0.0}
        if(tipo == 'CON') {
            aplicaciones = aplicaciones.findAll{it.cobro.sucursal.nombre == poliza.sucursal}
            generarContado(poliza, aplicaciones)
        } else if(tipo == 'COD') {
            aplicaciones = aplicaciones.findAll{it.cobro.sucursal.nombre == poliza.sucursal}
            generarCod(poliza, aplicaciones)
        } else if(tipo == 'CRE') {
            generarCredito(poliza, aplicaciones)
        } else  if(tipo == 'CHE') {
            generarChe(poliza, aplicaciones)
        } else  if(tipo == 'JUR') {
            generarJur(poliza, aplicaciones)
        }

    }

    def generarContado(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CON')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            def clienteClave = "105-0001-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarCod(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'COD')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            def clienteClave = "105-0002-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }


    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarCredito(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CON')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            Cobro cob = it.cobro
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()
            def clienteClave = "105-0003-${co.cuentaOperativa}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarChe(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CON')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            Cobro cob = it.cobro
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()

            def clienteClave = "106-0001-${co.cuentaOperativa}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    def generarJur(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'JUR')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            Cobro cob = it.cobro
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()

            def clienteClave = "106-0002-${co.cuentaOperativa}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    Map<String, Object> buildRow(AplicacionDeCobro a, String tipo) {
        Map map = [:]
        Cobro cobro = a.cobro
        map.asiento = "COB_OGST_${tipo}"
        map.descripcion = "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                " ${a.cuentaPorCobrar.tipoDocumento}" +
                " ${a.cuentaPorCobrar.sucursal.nombre}"

        map.referencia = a.cobro.cliente.nombre
        map.referencia2 = a.cobro.cliente.nombre
        map.origen = a.cobro.id
        map.entidad = 'Cobro'
        map.documento = a.cuentaPorCobrar.documento
        map.documentoTipo =  a.cuentaPorCobrar.tipoDocumento
        map.documentoFecha = a.cuentaPorCobrar.fecha
        map.sucursal = a.cuentaPorCobrar.sucursal.nombre

        return map
    }

    List<AplicacionDeCobro> findAplicaciones(Date dia, String tpo) {
        return AplicacionDeCobro
                .where{ fecha == dia  && cobro.tipo == tpo }
                .where{cobro.formaDePago == 'PAGO_DIF'}
                .list()
    }


    PolizaDet buildDet(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: row.entidad,
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        return det
    }
}
