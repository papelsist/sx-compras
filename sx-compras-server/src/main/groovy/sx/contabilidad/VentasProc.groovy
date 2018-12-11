package sx.contabilidad

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component

import static sx.contabilidad.Mapeo.*

@Slf4j
@Component
class VentasProc implements  ProcesadorDePoliza {

    static String IVA_NO_TRASLADADO = "209-0001-0000-0000"

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
            throw new RuntimeException("No eixste mapeo de cuenta deudora para el cliente:  ${row.cliente}")
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

        CuentaContable cuenta = buscarCuenta(IvaNoTrasladadoVentas.clave)
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
