package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

import sx.core.Sucursal
import sx.core.Venta
import sx.cxc.Cobro
import sx.cxc.CobroCheque
import sx.cxc.CobroDeposito
import sx.cxc.CobroTarjeta
import sx.cxc.CobroTransferencia
import sx.cxc.CuentaPorCobrar
import sx.tesoreria.CorteDeTarjeta
import sx.tesoreria.CorteDeTarjetaAplicacion
import sx.tesoreria.Ficha

import static sx.contabilidad.Mapeo.*



@Slf4j
@Component
class CobranzaConProc implements  ProcesadorMultipleDePolizas{

    static String IVA_NO_TRASLADADO = "209-0001-0000-0000"


    @Override
    String definirConcepto(Poliza poliza) {
        return "COBRANZA CONTADO"
    }

    @Override
    Poliza recalcular(Poliza poliza) {

        poliza.partidas.clear()

        String selectDebeBanco = getCargoBancoQuery()
                .replaceAll('@SUCURSAL', poliza.sucursal)
                .replaceAll('@FECHA', toSqlDate(poliza.fecha))


        String selectHaberVenta = getAbonoVentaQuery()
                .replaceAll('@SUCURSAL', poliza.sucursal)
                .replaceAll('@FECHA', toSqlDate(poliza.fecha))

        String selectHaberSaf = getAbonoSafQuery()
                .replaceAll('@SUCURSAL', poliza.sucursal)
                .replaceAll('@FECHA', toSqlDate(poliza.fecha))

        String selectHaberOprd = getAbonoOprodQuery()
                .replaceAll('@SUCURSAL', poliza.sucursal)
                .replaceAll('@FECHA', toSqlDate(poliza.fecha))

        String selectDebeOgst = getCargoOgstQuery()
                .replaceAll('@SUCURSAL', poliza.sucursal)
                .replaceAll('@FECHA', toSqlDate(poliza.fecha))

        def rows = []

        rows += getAllRows(selectDebeBanco, [])
        rows += getAllRows(selectHaberVenta, [])
        rows += getAllRows(selectHaberSaf, [])
        rows += getAllRows(selectHaberOprd, [])  
        rows += getAllRows(selectDebeOgst, [])
        rows = rows.findAll {it.sucursal == poliza.sucursal}
        log.info('Rows: {}', rows.size())
             
        rows.each{ row ->
            if(row.tipo == 'DEBE_BANCO'){

                if(row.referencia2.contains('AMEX_INGRESO')){
                    cargoAbonoBancoAmex(poliza,row,true)
                    cargoAbonoBancoAmex(poliza,row,false)
                }

                if(!row.referencia2.contains('AMEX_COMISION')){
                    cargoBanco(poliza,row)
                }
                
                if(row.asiento.contains('xIDENT')){
                    cargoIvaxIdent(poliza,row)
                } 

                if(row.referencia2.endsWith('COMISION')){
                    cargoComisionBancaria(poliza,row)
                }
                if(row.referencia2.endsWith('COMISION_IVA')){
                    cargoIvaComisionBancaria(poliza,row)
                }
            }

            if(row.tipo == 'HABER_VENTA'){
                abonoProvision(poliza,row)

            }

            if(row.tipo == 'HABER_SAF'){
                abonoSaldoAFavor(poliza, row)
            }

            if(row.tipo == 'HABER_OPRD'){
                abonoOtrosProductos(poliza, row)
            }
              if(row.tipo == 'DEBE_OGST'){
                cargoOtrosGastos(poliza, row)
            }
        }
        log.info('Partidas generadas: {}', poliza.partidas.size())
        return poliza
    }

    def cargoAbonoBancoAmex(Poliza poliza,def row,boolean cargo){


        CuentaContable cuenta = buscarCuenta("107-0001-0001-0000")

        String descripcion  = descripcion(row)

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
                debe: Math.abs(row.total)
        )

        if(!cargo){
            det.haber = Math.abs(row.total)
            det.debe = 0.0
        }
        // Generar complemento de cobro
        SatPagoOtro otroMP = new SatPagoOtro()


        poliza.addToPartidas(det)


    }

    def cargoBanco(Poliza poliza,def row){

        CuentaContable cuenta = buscarCuenta(row.cta_contable)

        String descripcion  = descripcion(row)

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
                debe: Math.abs(row.total)
        )
            if(row.asiento.contains('xIDENT')) 
                det.debe = row.subtotal
            
            if(!row.referencia2.contains('AMEX') && (row.referencia2.contains('COMISION') || row.referencia2.contains('COMISION_IVA') )){
                det.haber = Math.abs(row.total)
                det.debe = 0.0
            }

             if(row.referencia2.contains('AMEX_INGRESO') ){

                CorteDeTarjeta corte = CorteDeTarjeta.get(row.origen) 

                CorteDeTarjetaAplicacion aplicacionComision= CorteDeTarjetaAplicacion.findByCorteAndTipo(corte,'AMEX_COMISION')
                CorteDeTarjetaAplicacion aplicacionIva= CorteDeTarjetaAplicacion.findByCorteAndTipo(corte,'AMEX_COMISION_IVA')

                det.haber = 0.0
                det.debe = Math.abs(row.total)-aplicacionComision.importe-aplicacionIva.importe
            }
            

        
        poliza.addToPartidas(det)
    }

    def cargoComisionBancaria(Poliza poliza,def row){

        def claveSuc = ''
        if( new Integer(row.suc).intValue() < 10){
            claveSuc = "000${row.suc}"
        }else{
            claveSuc = "00${row.suc}"
        }

        CuentaContable cuenta = buscarCuenta("600-0014-${claveSuc}-0000")

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
                debe: Math.abs(row.total)
        )
        
        poliza.addToPartidas(det)
    }

    def cargoIvaComisionBancaria(Poliza poliza,def row){

        CuentaContable cuenta = buscarCuenta("118-0002-0000-0000")

        String descripcion  = descripcion(row)

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
                debe: Math.abs(row.total)
        )
        
        poliza.addToPartidas(det)
    }

    def cargoIvaxIdent(Poliza poliza,def row){

        CuentaContable cuenta = buscarCuenta(row.cta_iva)

        String descripcion  = descripcion(row)

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
                debe: row.impuesto
        )
        
        poliza.addToPartidas(det)

    }

    def abonoOtrosProductos(Poliza poliza, def row){
 
        CuentaContable cuenta = buscarCuenta(row.cta_contable)

        String descripcion  = descripcion(row)

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
                haber: row.total,
                debe: 0.0
        )
        poliza.addToPartidas(det)

    }

    def cargoOtrosGastos(Poliza poliza, def row){
 
        CuentaContable cuenta = buscarCuenta(row.cta_contable)

        String descripcion  = descripcion(row)

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

    def abonoProvision(Poliza poliza,def row){

        CuentaContable cuenta = CuentaContable.findByClave(row.cta_contable)

        String descripcion  = descripcion(row)

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
                haber: row.total,
                debe: 0.0
        )
        poliza.addToPartidas(det)
    }

    def abonoSaldoAFavor(Poliza poliza, def row){

        CuentaContable cuenta = buscarCuenta(row.cta_contable)

        String descripcion  = descripcion(row)

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

    def abonoIvaVenta(Poliza poliza,def row){

        CuentaContable cuenta = buscarCuenta(IvaNoTrasladadoVentas.clave)
        String descripcion  = descripcion(row)
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


    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        List<Sucursal> sucursals = getSucursales()
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
                p.concepto = "COBRANZA CONTADO  ${it.nombre}"
                p.fecha = command.fecha
                p.sucursal = it.nombre
                log.info('Agregando poliza: {}', it)
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }

    def descripcion(def row) {
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "${tipoDocumento(row)} ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        return descripcion
    }

    def tipoDocumento(def row) {
        if(['DEBE_BANCO', 'HABER_SAF', 'HABER_OPRD']
                .contains(row.tipo) ){
            def asiento = row.asiento
            if(asiento.contains('FICHA'))
                return 'Ficha:'
            else if(asiento.contains('TARJ'))
                return 'Tar:'
            else if(asiento.contains('DEP'))
                return 'Dep:'
            else if(asiento.contains('TRANSF'))
                return 'Transf:'
        } else
            return 'F: '

    }

    @Override
    Poliza generarComplementos(Poliza poliza) {
        log.info('Generando complementos para {} {}', poliza.subtipo, poliza.folio)
        poliza.partidas.each {
            it.otros.clear()
        }
        // Fichas depoito
        complementoFichasEfectivo(poliza)

        complementoFichasCheque(poliza)
        complementoTarjetas(poliza)
        complementoDeposito(poliza)
        complementoTransferencia(poliza)
        poliza.satComplementos = new Date()
        log.info('Complementos generados {}', poliza.satComplementos)
        return poliza
    }

    void complementoFichasEfectivo(Poliza poliza) {
        log.info('Complemento de pago: EFECTIVO ' )
        PolizaDet selected = poliza.partidas.find {it.asiento.contains('FICHA') && it.referencia2.contains('EFECTIVO')}
        if(selected) {

            List<PolizaDet> ventas = poliza.partidas.findAll{it.cuenta.clave.startsWith('105') && it.asiento.contains('FICHA')}
            ventas.each { d ->
                CuentaPorCobrar vta = CuentaPorCobrar.get(d.origen)
                if(vta.formaDePago == 'EFECTIVO') {
                    SatPagoOtro pagoOtro = new SatPagoOtro()
                    pagoOtro.rfc = vta.cliente.rfc
                    pagoOtro.fecha = selected.poliza.fecha
                    pagoOtro.monto = vta.total
                    pagoOtro.benef = getEmpresa().nombre
                    pagoOtro.metPagoPol = SatMetotoDePago.EFECTIVO.value
                    pagoOtro.asiento = "${selected.asiento}_EFECTIVO"
                    selected.otros.add(pagoOtro)
                }
            }
        }
    }

    void complementoFichasCheque(Poliza poliza) {
        log.info('Complemento de pago: CHEQUE ' )
        List<PolizaDet> rows = poliza.partidas.findAll {it.asiento.contains('FICHA') && it.referencia2.contains('BANCO')}
        rows.each { selected ->
            Ficha ficha = Ficha.get(selected.origen)
            List<CobroCheque> cheques = CobroCheque.where{ficha == ficha && cambioPorEfectivo == false}.list()
            cheques.each { che ->
                SatPagoOtro pagoOtro = new SatPagoOtro()
                pagoOtro.rfc = che.cobro.cliente.rfc
                pagoOtro.fecha = selected.poliza.fecha
                pagoOtro.monto = che.cobro.importe
                pagoOtro.benef = getEmpresa().nombre
                pagoOtro.metPagoPol = '99'
                pagoOtro.asiento = "${selected.asiento}_CHEQUE"
                selected.otros.add(pagoOtro)
            }
        }

    }



    void complementoTarjetas(Poliza poliza) {
        log.info('Complemento de pago: TARJETA ' )
        List<PolizaDet> found = poliza.partidas
                .findAll{it.cuenta.clave.startsWith('102') && it.asiento.contains('TARJ') && it.referencia.contains('INGRESO')}
        found.each { selected ->
            CorteDeTarjeta corte = CorteDeTarjeta.get(selected.origen)
            List<CobroTarjeta> cobros = CobroTarjeta.where{corte == corte.id}.list()
            if(cobros) {
                cobros.each { cc ->
                    SatPagoOtro pagoOtro = new SatPagoOtro()
                    pagoOtro.rfc = cc.cobro.cliente.rfc
                    pagoOtro.fecha = selected.poliza.fecha
                    pagoOtro.monto = cc.cobro.importe
                    pagoOtro.benef = getEmpresa().nombre
                    if(cc.debitoCredito) {
                        pagoOtro.metPagoPol = SatMetotoDePago.TARJETA_DEBITO.value
                        pagoOtro.asiento = "${selected.asiento}_DEBITO"
                    } else {
                        pagoOtro.metPagoPol = SatMetotoDePago.TARJETA_CREDITO.value
                        pagoOtro.asiento = "${selected.asiento}_CREDITO"
                    }
                    selected.otros.add(pagoOtro)
                }
            }
        }
    }

    void complementoDeposito(Poliza poliza) {
        log.info('Complemento de pago: DEPOSITOS EFECTIVO' )
        List<PolizaDet> depositos = poliza.partidas.findAll{it.asiento.contains('DEP')}
        depositos = depositos.findAll{it.cuenta.clave.startsWith('102') || it.cuenta.clave.startsWith('205')}

        depositos.each {
            Cobro cobro = Cobro.get(it.origen)
            if(cobro) {
                CobroDeposito cd = cobro.deposito
                if(cd) {
                    SatPagoOtro pagoOtro = new SatPagoOtro()
                    pagoOtro.rfc = cobro.cliente.rfc
                    pagoOtro.fecha = it.poliza.fecha
                    pagoOtro.monto = cobro.importe
                    pagoOtro.benef = getEmpresa().nombre
                    pagoOtro.metPagoPol = '99'
                    pagoOtro.asiento = it.asiento
                    it.otros.add(pagoOtro)
                }
            }

        }
    }

    void complementoTransferencia(Poliza poliza) {
        log.info('Complemento de pago: TRANSFERENCIAS ' )
        List<PolizaDet> depositos = poliza.partidas.findAll{it.asiento.contains('TRANSF')}
        depositos = depositos.findAll{it.cuenta.clave.startsWith('102') || it.cuenta.clave.startsWith('205')}
        log.info('Transferencias: {}', depositos.size())
        depositos.each {
            Cobro cobro = Cobro.get(it.origen)
            if(cobro) {
                CobroTransferencia cd = cobro.transferencia
                if(cd) {
                    SatPagoOtro pagoOtro = new SatPagoOtro()
                    pagoOtro.rfc = cobro.cliente.rfc
                    pagoOtro.fecha = it.poliza.fecha
                    pagoOtro.monto = cobro.importe
                    pagoOtro.benef = getEmpresa().nombre
                    pagoOtro.metPagoPol = '99'
                    pagoOtro.asiento = it.asiento
                    it.otros.add(pagoOtro)
                }
            }

        }
    }



    // QUERYES
    String getCargoBancoQuery() {

        String res = """
        SELECT          
        'DEBE_BANCO' tipo,
        round(x.total/1.16,2) subtotal,
        x.total-round(x.total/1.16,2) impuesto,
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
        x.cta_contable,
        x.cta_iva
        FROM (                                                       
        SELECT concat('COB_','FICHA_',f.origen) as asiento,f.id origen,f.origen documentoTipo,f.fecha,f.folio documento,'MXN' moneda,1 tc 
        ,f.total,f.tipo_de_ficha referencia2,s.nombre sucursal, s.clave as suc,z.descripcion cliente,concat('102-0001-',z.sub_cuenta_operativa,'-0000') as cta_contable
        ,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_iva
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) left join cobro_cheque x on(x.ficha_id=f.id) left join cobro b on(x.cobro_id=b.id)  
        where f.fecha='@FECHA' and f.origen in('CON')                       
        UNION                        
        SELECT concat('COB_','DEP_',f.tipo,(case when m.por_identificar is true then '_xIDENT' else '' end)) as asiento,f.id origen,f.tipo documentoTipo,f.primera_aplicacion,x.folio documento,f.moneda,f.tipo_de_cambio tc 
        ,f.importe,c.nombre referencia2,s.nombre sucursal, s.clave as suc,z.descripcion banco,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable
        ,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_iva
        FROM cobro f join cobro_deposito x on(x.cobro_id=f.id) join movimiento_de_cuenta m on(x.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) join cliente c on(f.cliente_id=c.id)
        where f.primera_aplicacion='@FECHA' and f.tipo in('CON')                
        UNION        
        SELECT concat('COB_','TRANSF_',f.tipo,(case when m.por_identificar is true then '_xIDENT' else '' end)) as asiento,f.id origen,f.tipo documentoTipo,f.primera_aplicacion,x.folio documento,f.moneda,f.tipo_de_cambio tc 
        ,f.importe,c.nombre referencia2,s.nombre sucursal, s.clave as suc,z.descripcion banco,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable
        ,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_iva
        FROM cobro f join cobro_transferencia x on(x.cobro_id=f.id) join movimiento_de_cuenta m on(x.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) join cliente c on(f.cliente_id=c.id)
        where f.primera_aplicacion='@FECHA' and f.tipo in('CON')                  
        UNION 
       SELECT concat('COB_','TARJ_CON') as asiento,t.id origen,f.tipo documentoTipo,t.corte,t.folio documento,'MXN'moneda,1.00 tc 
        ,f.importe,a.tipo referencia2,s.nombre sucursal, s.clave as suc,z.descripcion banco,concat('102-0001-',z.sub_cuenta_operativa,'-0000') as cta_contable 
        ,(case when f.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_iva
        from corte_de_tarjeta t join corte_de_tarjeta_aplicacion a on(a.corte_id=t.id)
        join movimiento_de_cuenta f on(a.ingreso_id=f.id) join cuenta_de_banco z on(f.cuenta_id=z.id)
        join sucursal s on(f.sucursal=s.nombre) 
        where t.corte='@FECHA'               
        ) as x   
        """
        return res
    }

    String getAbonoVentaQuery() {
        String haberVenta = """
        SELECT 
        'HABER_VENTA' tipo,
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
        x.cta_contable,
        x.cta_iva
        FROM (                       
        SELECT concat('COB_',(case 	when b.forma_de_pago in('EFECTIVO','CHEQUE') then 'FICHA'when b.forma_de_pago like 'TARJETA%' then 'TARJ'        				
        				when b.forma_de_pago in('TRANSFERENCIA') then 'TRANSF' else substr(b.forma_de_pago,1,3) end),'_',f.tipo,
        				(case when  b.forma_de_pago like 'DEPOSIT%' and (SELECT m.por_identificar FROM cobro_deposito xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id) where xx.cobro_id=b.id)=true then '_xIDENT'
        				when  b.forma_de_pago in('TRANSFERENCIA') and (SELECT m.por_identificar FROM cobro_transferencia xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id)  where xx.cobro_id=b.id)=true then '_xIDENT'
        				else '' end)) as asiento
        ,f.id as origen,f.tipo documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio tc,sum(round(a.importe/1.16,2)) subtotal,sum(a.importe-round(a.importe/1.16,2)) impuesto,sum(a.importe) total,s.nombre referencia2,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente
        ,concat('105-0001-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') as cta_contable,'209-0001-0000-0000' as cta_iva     
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)   join aplicacion_de_cobro a on(a.cuenta_por_cobrar_id=f.id)
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id) join cobro b on(a.cobro_id=b.id)
        where f.fecha='@FECHA' and f.tipo in('CON') and f.tipo_documento='VENTA' and f.cancelada is null and f.sw2 is null
        and b.forma_de_pago not in('PAGO_DIF','DEVOLUCION','BONIFICACION') and a.fecha=b.primera_aplicacion        
        group by f.fecha,f.id,s.id,f.moneda,f.tipo_de_cambio ,
        			concat('COB_',(case 	when b.forma_de_pago in('EFECTIVO','CHEQUE') then 'FICHA'when b.forma_de_pago like 'TARJETA%' then 'TARJ'        				
        				when b.forma_de_pago in('TRANSFERENCIA') then 'TRANSF' else substr(b.forma_de_pago,1,3) end),'_',f.tipo,
        				(case when  b.forma_de_pago like 'DEPOSIT%' and (SELECT m.por_identificar FROM cobro_deposito xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id) where xx.cobro_id=b.id)=true then '_xIDENT'
        				when  b.forma_de_pago in('TRANSFERENCIA') and (SELECT m.por_identificar FROM cobro_transferencia xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id)  where xx.cobro_id=b.id)=true then '_xIDENT'
        				else '' end))       				        				       					    
	    UNION	   
	    SELECT 'COB_TARJ_CON' as asiento  ,f.id as origen,f.tipo documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio tc,sum(round(a.importe/1.16,2)) subtotal,sum(a.importe-round(a.importe/1.16,2)) impuesto,sum(a.importe) total,s.nombre referencia2,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente
        ,concat('105-0002-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') as cta_contable,'209-0001-0000-0000' as cta_iva
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)   join aplicacion_de_cobro a on(a.cuenta_por_cobrar_id=f.id)
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id) join cobro b on(a.cobro_id=b.id)
        where a.fecha='@FECHA' and 
        f.tipo in('COD') and f.tipo_documento='VENTA'and f.cancelada is null and f.sw2 is null
        and b.forma_de_pago like 'TARJ%'
        group by a.fecha,f.id,s.id,f.moneda,f.tipo_de_cambio ,
            concat('COB_',(case when b.forma_de_pago like 'TARJETA%' then 'TARJ' else substr(b.forma_de_pago,1,3) end),'_',f.tipo) 
        UNION  
        SELECT 'COB_FICHA_CON' as asiento  ,f.id as origen,f.tipo documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio tc,sum(round(a.importe/1.16,2)) subtotal,sum(a.importe-round(a.importe/1.16,2)) impuesto,sum(a.importe) total,s.nombre referencia2,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente
        ,concat('105-0002-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') as cta_contable,'209-0001-0000-0000' as cta_iva
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)   join aplicacion_de_cobro a on(a.cuenta_por_cobrar_id=f.id)
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id) join cobro b on(a.cobro_id=b.id)
        where a.fecha='@FECHA' and 
        f.tipo in('COD') and f.tipo_documento='VENTA'and f.cancelada is null and f.sw2 is null
        and b.forma_de_pago like 'EFECT%'
        group by a.fecha,f.id,s.id,f.moneda,f.tipo_de_cambio ,
            concat('COB_FICHA_',f.tipo) 
        ) as x
    """
        return haberVenta
    }

    String getAbonoSafQuery() {
        String haberSaf = """
        SELECT  'HABER_SAF' tipo,
        x.total-round(x.total/1.16,2) subtotal,
        round(x.total/1.16,2) impuesto,
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
        x.cta_contable,
        x.cta_iva
        FROM (        
        SELECT concat('COB_',(case 	when b.forma_de_pago in('EFECTIVO','CHEQUE') then 'FICHA'when b.forma_de_pago like 'TARJETA%' then 'TARJ'        				
        				when b.forma_de_pago in('TRANSFERENCIA') then 'TRANSF' else substr(b.forma_de_pago,1,3) end),'_',f.tipo,
        				(case when  b.forma_de_pago like 'DEPOSIT%' and (SELECT m.por_identificar FROM cobro_deposito xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id) where xx.cobro_id=b.id)=true then '_xIDENT'
        				when  b.forma_de_pago in('TRANSFERENCIA') and (SELECT m.por_identificar FROM cobro_transferencia xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id)  where xx.cobro_id=b.id)=true then '_xIDENT'
        				else '' end),'_SAF') as asiento
        ,b.id as origen,f.tipo documentoTipo,f.fecha,referencia documento
        ,f.moneda,f.tipo_de_cambio tc ,b.importe,b.diferencia,b.importe-b.diferencia-sum( ifnull((SELECT sum(y.importe) FROM aplicacion_de_cobro y where y.cobro_id=b.id),0)) total
        ,s.nombre referencia2,s.nombre sucursal, s.clave as suc,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente
        ,'205-0001-0001-0000' as cta_contable,'209-0004-0000-0000' as cta_iva        
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)   join aplicacion_de_cobro a on(a.cuenta_por_cobrar_id=f.id)
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id) join cobro b on(a.cobro_id=b.id)
        where f.fecha='@FECHA' and f.tipo in('CON') and f.tipo_documento='VENTA' and f.cancelada is null and f.sw2 is null
        and b.forma_de_pago not in('PAGO_DIF','DEVOLUCION','BONIFICACION') and a.fecha=b.primera_aplicacion        
        group by b.id,s.id,f.moneda,f.tipo_de_cambio ,
        			concat('COB_',(case 	when b.forma_de_pago in('EFECTIVO','CHEQUE') then 'FICHA'when b.forma_de_pago like 'TARJETA%' then 'TARJ'        				
        				when b.forma_de_pago in('TRANSFERENCIA') then 'TRANSF' else substr(b.forma_de_pago,1,3) end),'_',f.tipo,
        				(case when  b.forma_de_pago like 'DEPOSIT%' and (SELECT m.por_identificar FROM cobro_deposito xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id) where xx.cobro_id=b.id)=true then '_xIDENT'
        				when  b.forma_de_pago in('TRANSFERENCIA') and (SELECT m.por_identificar FROM cobro_transferencia xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id)  where xx.cobro_id=b.id)=true then '_xIDENT'
        				else '' end),'_SAF') having (b.importe-b.diferencia-sum( ifnull((SELECT sum(y.importe) FROM aplicacion_de_cobro y where y.cobro_id=b.id),0)))<>0        
        ) as x  
    """
        return haberSaf
    }

    String getAbonoOprodQuery() {
        String haberOprd = """
    	SELECT  'HABER_OPRD' tipo,
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
        x.cta_contable,
        x.cta_iva
        FROM (          
        SELECT b.id,concat('COB_',(case 	when b.forma_de_pago in('EFECTIVO','CHEQUE') then 'FICHA'when b.forma_de_pago like 'TARJETA%' then 'TARJ'        				
        				when b.forma_de_pago in('TRANSFERENCIA') then 'TRANSF' else substr(b.forma_de_pago,1,3) end),'_',f.tipo,
        				(case when  b.forma_de_pago like 'DEPOSIT%' and (SELECT m.por_identificar FROM cobro_deposito xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id) where xx.cobro_id=b.id)=true then '_xIDENT'
        				when  b.forma_de_pago in('TRANSFERENCIA') and (SELECT m.por_identificar FROM cobro_transferencia xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id)  where xx.cobro_id=b.id)=true then '_xIDENT'
        				else '' end),'_OPRD') as asiento
        ,b.id as origen,f.tipo documentoTipo,f.fecha,referencia documento
        ,f.moneda,f.tipo_de_cambio tc ,round(b.diferencia/1.16,2) subtotal,b.diferencia-round(b.diferencia/1.16,2) impuesto,b.diferencia total
        ,s.nombre referencia2,s.nombre sucursal, s.clave as suc,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente
        ,'704-0001-0000-0000' as cta_contable,'209-0004-0000-0000' as cta_iva   
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)   join aplicacion_de_cobro a on(a.cuenta_por_cobrar_id=f.id)
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id) join cobro b on(a.cobro_id=b.id)
        where b.diferencia_fecha='@FECHA' and f.tipo in('CON') and f.tipo_documento='VENTA' and f.cancelada is null and f.sw2 is null
        and b.forma_de_pago not in('PAGO_DIF') and b.diferencia<>0     
        group by b.id,s.id,f.moneda,f.tipo_de_cambio ,
        			concat('COB_',(case 	when b.forma_de_pago in('EFECTIVO','CHEQUE') then 'FICHA'when b.forma_de_pago like 'TARJETA%' then 'TARJ'        				
        				when b.forma_de_pago in('TRANSFERENCIA') then 'TRANSF' else substr(b.forma_de_pago,1,3) end),'_',f.tipo,
        				(case when  b.forma_de_pago like 'DEPOSIT%' and (SELECT m.por_identificar FROM cobro_deposito xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id) where xx.cobro_id=b.id)=true then '_xIDENT'
        				when  b.forma_de_pago in('TRANSFERENCIA') and (SELECT m.por_identificar FROM cobro_transferencia xx join movimiento_de_cuenta m on(xx.ingreso_id=m.id)  where xx.cobro_id=b.id)=true then '_xIDENT'
        				else '' end),'_OPRD') 
        ) as x 
	   
    """
    }

    String getCargoOgstQuery() {
        String DebeOgst = """
        SELECT 'DEBE_OGST' tipo,
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
        x.cta_contable,
        x.cta_iva
        FROM (                 
        SELECT concat('COB_','PAGO_DIF_',f.tipo) as asiento,f.id origen,f.tipo documentoTipo,a.fecha,f.documento,f.moneda,f.tipo_de_cambio tc 
        ,round(a.importe/1.16,2) subtotal,a.importe-round(a.importe/1.16,2) impuesto,a.importe total,c.nombre referencia2,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente,c.nombre,'703-0001-0000-0000' as cta_contable,'209-0001-0000-0000' as cta_iva
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)   join aplicacion_de_cobro a on(a.cuenta_por_cobrar_id=f.id)
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id) join cobro b on(a.cobro_id=b.id)
        where a.forma_de_pago='PAGO_DIF'  and b.fecha='@FECHA' and f.tipo in('CON')        
        ) as x
    
        """
    }

}