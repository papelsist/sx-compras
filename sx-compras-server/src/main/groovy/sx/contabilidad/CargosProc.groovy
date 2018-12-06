package sx.contabilidad

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component

@Slf4j
@Component
class CargosProc implements  ProcesadorDePoliza{

    String QUERY = """
        SELECT 
        x.subtotal,
        x.impuesto,
        x.total,
        x.fecha,
        x.moneda,
        x.tc,
        x.documento,
        x.sucursal,
        x.documentoTipo,
        x.asiento,
        x.referencia2,
        x.origen,
        x.cliente
        FROM (
        SELECT concat(f.tipo_documento,'_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal,f.cliente_id as cliente
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) LEFT join cfdi x on(f.cfdi_id=x.id)
        where  f.fecha='2018-11-26' and f.tipo_documento in('CHEQUE_DEVUELTO','NOTA_DE_CARGO') and f.sw2 is null and (x.cancelado is false or x.cancelado is null)
        UNION
        SELECT concat(f.tipo_documento,'_JUR') as asiento,f.id as origen,'JUR' as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal,f.cliente_id
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) left  join cfdi x on(f.cfdi_id=x.id)
        join juridico j on(j.cxc_id=f.id)
        where j.traspaso='2015-10-08'  
        ) as x
        
    """

    @Override
    String definirConcepto(Poliza poliza) {
        return "Ventas"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        String select = QUERY.replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        log.info('Actualizando poliza {} procesando {} registros', poliza.id, rows.size())
        rows.each { row ->
            cargoClientes(poliza, row)
            abonoVentas(poliza, row)
            abonoIvaNoTrasladado(poliza, row)
        }

        return poliza
    }

    def cargoClientes(Poliza poliza, def row) {
        CuentaDeudoraMapeo mapeo = CuentaDeudoraMapeo
                .where {contexto == 'CLIENTES' && deudor == row.cliente}
                .find()
        if(mapeo == null) {
            throw new RuntimeException("No eixste cuenta en Clienes para ${row}")
        }
        CuentaContable cuenta = mapeo.cuenta
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.fecha,
                sucursal: row.sucursal,
                haber: 0.0,
                debe: row.total
        )
        poliza.addToPartidas(det)
    }

    def abonoVentas(Poliza poliza, def row) {

        String tipo = row.documentoTipo
        CuentaContable cuenta = null
        CuentaContable mayor = buscarCuenta('401-0000-0000-0000')
        switch (tipo) {
            case 'CON':
                CuentaContable subcta = mayor.subcuentas.find {it.clave == '401-0001-0000-0000'}
                cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}
                break
            case 'COD':
                CuentaContable subcta = mayor.subcuentas.find {it.clave == '401-0002-0000-0000'}
                cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}
                break
            case 'CRE':
                CuentaContable subcta = mayor.subcuentas.find {it.clave == '401-0003-0000-0000'}
                cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}
                break
        }
        if(!cuenta)
            throw new RuntimeException("No eixste cuenta contable para el abono a ventas del reg: ${row}")
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.fecha,
                sucursal: row.sucursal,
                haber: row.subtotal,
                debe: 0.0
        )
        poliza.addToPartidas(det)
    }

    def abonoIvaNoTrasladado(Poliza poliza, def row) {
        CuentaContable cuenta = buscarCuenta('209-0001-0000-0000')
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.fecha,
                sucursal: row.sucursal,
                haber: row.impuesto,
                debe: 0.0
        )
        poliza.addToPartidas(det)
    }
}
