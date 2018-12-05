package sx.contabilidad

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component

@Slf4j
@Component
class VentasProc implements  ProcesadorDePoliza{

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
        x.suc,
        x.documentoTipo,
        x.asiento,
        x.referencia2,
        x.origen,
        x.cliente
        FROM (
        SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc, f.cliente_id as cliente
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
        where  f.fecha='@FECHA' and tipo in('CRE') and f.tipo_documento='VENTA' and x.cancelado is false and f.sw2 is null
        UNION
        SELECT concat('VENTAS_',f.tipo) as asiento,null as id,f.tipo,f.fecha,null
        ,f.moneda,f.tipo_de_cambio,sum(f.subtotal),sum(f.impuesto),sum(f.total),s.nombre,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id 
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
        where f.fecha='@FECHA' and tipo in('CON','COD') and f.tipo_documento='VENTA'and x.cancelado is false and f.sw2 is null
        group by fecha,s.id,f.tipo,f.moneda,f.tipo_de_cambio
        ) as x
    """

    @Override
    String definirConcepto(Poliza poliza) {
        return "Ventas"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        log.info('Actualizando el calculo de la poliza  {}', poliza)
        String select = QUERY.replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        rows.each { row ->
            log.info('Procesando: {}', row)
            cargoClientes(poliza, row)
            abonoVentas(poliza, row)
        }
        log.info('Procesando {} registros', rows.size())
        return poliza
    }

    def cargoClientes(Poliza poliza, def row) {
        log.info('Abono a clientes ')
        CuentaDeudoraMapeo mapeo = CuentaDeudoraMapeo
                .where {contexto == 'CLIENTES' && deudor == row.cliente}
                .find()
        if(mapeo == null) {
            throw new RuntimeException("No eixste cuenta en Clienes para ${row}")
        }
        CuentaContable cuenta = mapeo.cuenta
        log.info('Cuenta: {}', cuenta)
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
            debe: row.subtotal
        )
        poliza.addToPartidas(det)
    }

    def abonoVentas(Poliza polizam, def row) {

        String tipo = row.documentoTipo
        String sucursal = row.sucursal
        CuentaContable cuenta = null
        CuentaContable mayor = CuentaContable.where{clave == '401-0000-0000-0000'}.find()
        switch (tipo) {
            case 'CON':
                CuentaContable subcta = mayor.subcuentas.find {it.clave == '401-0005-0000-0000'}
                cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}
                break
            case 'COD':
                CuentaContable subcta = mayor.subcuentas.find {it.clave == '401-0001-0000-0000'}
                cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}
                break
            case 'CRE':
                CuentaContable subcta = mayor.subcuentas.find {it.clave == '401-0002-0000-0000'}
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
                haber: 0.0,
                debe: row.subtotal
        )
        poliza.addToPartidas(det)
    }
}
