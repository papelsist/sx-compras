package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.tesoreria.MovimientoDeCuenta
import sx.core.Sucursal

import static sx.contabilidad.Mapeo.*


@Slf4j
@Component
class ChequeProc implements  ProcesadorDePoliza{

    String QUERY ="""
    
    
    """


    @Override
    String definirConcepto(Poliza poliza) {
        return "Egreso Cheque"
    }

    @Override
    Poliza recalcular(Poliza poliza) {

        poliza.partidas.clear()
        String select = QUERY.replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        log.info('Actualizando poliza {} procesando {} registros', poliza.id, rows.size())
        rows.each { row ->

        }


        poliza.partidas.clear()

        def egresos = MovimientoDeCuenta.executeQuery(" from MovimientoDeCuenta where fecha=? and forma_de_pago='CHEQUE' and  concepto='GASTO' ",[poliza.fecha] )

        egresos.each{egreso ->

            abonoBanco(poliza,egreso)
            cargoProvision(poliza,egreso)

        }

        return poliza
    }

    def abonoBanco(Poliza poliza, def egreso){

        CuentaContable cuenta = buscarCuenta('102-0001-'+egreso.cuenta.subCuentaOperativa+"-0000")

        Sucursal sucursal = Sucursal.findByNombre('OFICINAS')

        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable para el abono a banco del reg: ${egreso.id}")

        String descripcion  = "CH:"+egreso.referencia

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: 'PAGO_GASTO',
                referencia: egreso.referencia,
                referencia2: egreso.afavor,
                origen: egreso.tipo,
                entidad: 'Egreso',
                documento: egreso.cheque.folio,
                documentoTipo: egreso.tipo,
                documentoFecha: egreso.fecha,
                sucursal: sucursal,
                haber: egreso.importe,
                debe: 0.0
        )
        poliza.addToPartidas(det)
    }

    def cargoProvision(Poliza poliza,def egreso){

        println "Cargando a provision ..."

         CuentaContable cuenta = buscarCuenta('205-0005-0000-0000')
          Sucursal sucursal = Sucursal.findByNombre('OFICINAS')

        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable para el abono a banco del reg: ${egreso.id}")

        String descripcion  = "CH:"+egreso.referencia

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: 'PAGO_GASTO',
                referencia: egreso.referencia,
                referencia2: egreso.afavor,
                origen: egreso.tipo,
                entidad: 'Egreso',
                documento: egreso.cheque.folio,
                documentoTipo: egreso.tipo,
                documentoFecha: egreso.fecha,
                sucursal: sucursal,
                haber: egreso.importe,
                debe: 0.0
        )
        poliza.addToPartidas(det)

    }

    def cargoIvaProvision(Poliza poliza,def egreso){

        println "Cargando a Iva  Provision"

    }
    


}
