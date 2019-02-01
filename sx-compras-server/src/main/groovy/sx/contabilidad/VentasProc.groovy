package sx.contabilidad

import groovy.util.logging.Slf4j


import sx.core.Sucursal

import static sx.contabilidad.Mapeo.*

@Slf4j
abstract class VentasProc implements  ProcesadorMultipleDePolizas {

    abstract String getTipo()

    abstract  String getTipoLabel()

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
        x.cliente,
        x.cta_cliente,
        x.rfc,
        x.uuid
        FROM (        
        SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc, f.cliente_id as cliente
        ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=c.id ),'-0000') as cta_cliente, c.rfc, x.uuid
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
        where  f.fecha='@FECHA' and tipo in('CRE') and f.tipo_documento='VENTA' and x.cancelado is false and f.sw2 is null        
        UNION        
        SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id 
        ,concat('105-',(case when f.tipo='CON' then '0001-' when f.tipo='COD' then '0002-' else 'nd' end ),(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_cliente, c.rfc, x.uuid
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
        where f.fecha='@FECHA' and tipo in('CON','COD') and f.tipo_documento='VENTA'and x.cancelado is false and f.sw2 is null              
        ) as x
    """

    @Override
    String definirConcepto(Poliza poliza) {
        return "Ventas"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        // log.info('Recalculando poliza {}', poliza)
        poliza.partidas.clear()

        String select = QUERY.replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        rows = rows.findAll {it.sucursal == poliza.sucursal && it.documentoTipo == this.getTipo()}
        log.info('Actualizando poliza {} procesando {} registros', poliza.id, rows.size())
        rows.each { row ->
            cargoClientes(poliza, row)
            abonoVentas(poliza, row)
            abonoIvaNoTrasladado(poliza, row)
        }
        // ajustarConceptos(poliza)
        return poliza
    }

    def cargoClientes(Poliza poliza, def row) {
        // log.info('Cargo a clientes: {}', row)
        if(row.cta_cliente == null) {
            throw new RuntimeException("No existe cuenta operativa para el cliente:  ${row.referencia2} Id:${row.cliente} ")
        }
        CuentaContable cuenta = buscarCuenta(row.cta_cliente)//CuentaContable.findByClave(row.cta_cliente)

        String descripcion  = "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        if(row.tc > 1.0 ) {
            descripcion  = descripcion + " T.C: ${formatTipoDeCambio(row.tc)}"
        }
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
                debe: (row.total * row.tc)
        )

        // Comprobante nacional para el SAT
        def comprobante = new SatComprobanteNac(uuidcfdi: row.uuid, rfc: row.rfc, montoTotal: row.total)
        if(!comprobante.uuidcfdi) {
            throw new RuntimeException(
                    "Venta facturada ${row.documento} sin UUID. No se puede generar el complemento CompNac(SAT)")
        }
        if(row.moneda != 'MXN') {
            comprobante.moneda = row.moneda
            comprobante.tipCamb = row.tc
        }
        det.nacionales.add(comprobante)

        poliza.addToPartidas(det)
    }

    def abonoVentas(Poliza poliza, def row) {

        String descripcion  = "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        if(row.tc > 1.0 ) {
            descripcion  = descripcion + " T.C: ${formatTipoDeCambio(row.tc)}"
        }
        CuentaContable cuenta = null
        CuentaContable mayor = buscarCuenta('401-0000-0000-0000')

        String tipo = row.documentoTipo
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
                if(row.cliente == '402880fc5e4ec411015e4ec7a46701de') { // PAPELSA BAJIO
                    subcta = mayor.subcuentas.find {it.clave == '401-0004-0000-0000'}
                    // log.debug("Ajuste PARTES RELACIONADAS : {} SubCuenta: {} Sucursal: {}", row.referencia2, subcta, row.sucursal)
                    cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}

                } else
                    cuenta = subcta.subcuentas.find {it.descripcion == row.sucursal}
                break
        }

        if(!cuenta)
            throw new RuntimeException("No eixste sub cuenta de ${mayor.clave} para ${row.sucursal} en abono a ventas  registro: ${row}")

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
                haber: (row.subtotal * row.tc),
                debe: 0.0
        )
        poliza.addToPartidas(det)
    }

    def abonoIvaNoTrasladado(Poliza poliza, def row) {

        CuentaContable cuenta = buscarCuenta(IvaNoTrasladadoVentas.clave)
        String descripcion  = "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        if(row.tc > 1.0 ) {
            descripcion  = descripcion + " T.C: ${formatTipoDeCambio(row.tc)}"
        }
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
                haber: (row.impuesto * row.tc),
                debe: 0.0
        )
        poliza.addToPartidas(det)
    }

    /*
    def ajustarConceptos(Poliza poliza) {
        poliza.partidas.each {
            it.concepto = concatenar(it.cuenta)
        }
    }


    def concatenar(CuentaContable cta) {
        String cto = cta.descripcion
        def p1 = cta.padre
        if(p1) {
            cto = p1.descripcion + " " + cto
            def p2 = p1.padre
           if(p2) {
               cto = p2.descripcion + " " + cto
               def p3 = p2.padre
               if(p3) {
                   cto = p3.descripcion + " " + cto
               }
           }
        }
        return cto
    }
    */

    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        // log.info('Generando polizas  para {}', command)
        List<Sucursal> sucursals = getSucursales()
        // log.info("Generando polizas de ventas {} para {} sucursales", getTipoLabel(), sucursals.size())

        List<Poliza> polizas = []
        sucursals.each {
            String suc = it.nombre
            Poliza p = Poliza.where{
                        ejercicio == command.ejercicio &&
                        mes == command.mes &&
                        subtipo == command.subtipo &&
                        tipo == command.tipo &&
                        fecha == command.fecha &&
                        sucursal == suc
                        }.find()

            if(p == null) {

                p = new Poliza(ejercicio: command.ejercicio, mes: command.mes, subtipo: command.subtipo, tipo: command.tipo)
                p.concepto = "VENTAS ${this.getTipoLabel()}  ${it.nombre}"
                p.fecha = command.fecha
                p.sucursal = it.nombre
                log.info('Agregando poliza: {}', it)
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }
}
