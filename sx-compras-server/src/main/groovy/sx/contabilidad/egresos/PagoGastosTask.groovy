package sx.contabilidad.egresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Proveedor
import sx.cxp.CuentaPorPagar
import sx.cxp.Requisicion
import sx.cxp.RequisicionDet
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils
import sx.tesoreria.Cheque
import sx.cxp.Rembolso
import sx.cxp.RembolsoDet
import sx.cxp.GastoDet
import sx.core.Empresa
import sx.utils.Periodo


@Slf4j
@Component
class PagoGastosTask implements  AsientoBuilder, EgresoTask {

    /**
     * Genera los asientos requreidos por la poliza
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        Rembolso r = findRembolso(poliza)
        ajustarConcepto(poliza, r)
        log.info("Pago de REMBOLSO: {} {}", r.concepto, r.id)
        switch (r.concepto) {
            case 'REMBOLSO':
                cargoSucursal(poliza, r)
                break
            case 'GASTO':
                atenderGasto(poliza, r)
                break
            case 'DEVOLUCION':
                atenderPorCuentaContableRembolso(poliza , r)
                break
            case 'PRESTAMO' :
                atenderPorCuentaContableRembolso(poliza, r)
                break
            case 'PAGO':
                    
                CuentaContable cta = r.cuentaContable

                if(cta == null) throw new RuntimeException("No existe cuenta contable asignada al rembolso ${r.id}")

                if(cta.clave.startsWith('600-')) {
                    atenderGasto(poliza, r)
                } else
                if(cta.clave.startsWith('205-')) {
                    atenderGasto(poliza, r)
                } else
                if(cta.clave.startsWith('205-0008')) {
                    atenderDividendosHonorarios(poliza, r)
                } else if(cta.clave.startsWith('210-0001')) {
                    atenderPagoDeNomina(poliza, r)
                } else if(cta.clave.startsWith('205-D014')) {
                    atenderPagoFonacot(poliza, r)
                } else if(cta.clave.startsWith('213-0001')) {
                    atenderPagoSatImss(poliza, r)
                } else if(cta.clave.startsWith('213-0006')) {
                    atenderPagoSatImss(poliza, r)
                } else if(cta.clave.startsWith('205-0004')) {
                    //atenderPagoFlete(poliza, r)
                    cargoSucursal(poliza, r)
                }
                break
            case 'ESPECIAL':
                CuentaContable cta = r.cuentaContable
                if(cta == null) throw new RuntimeException("No exister cuenta contable asignada al rembolso ${r.id}")
                atenderEspecial(poliza, r)
                break
            case 'ESPECIALM':
                atenderEspecialMultiple(poliza, r)
                break
            default:
                log.info('No hay handler para: {}', r.concepto)
                break
        }

        abonoBanco(poliza, r)

    }


    void cargoSucursal(Poliza poliza, Rembolso r) {

       
        MovimientoDeCuenta egreso = r.egreso
        // String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia}  ${r.sucursal.nombre} "
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        Map row = [
                asiento: "REM: ${r.concepto}",
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]

        row.rfc = Empresa.first().rfc

        r.partidas.each{d -> 
            
            def cxp = d.cxp

            if(cxp) {    
                def gastos = GastoDet.findAllByCxp(cxp)
                
                gastos.each{gasto -> 
                    desc = "FAC: ${cxp.serie? cxp.serie : '' } ${cxp.folio} ${cxp.fecha} ${gasto.descripcion}"
                    def cuenta = gasto.cuentaContable
                    PolizaDet det = mapRow(cuenta, desc, row, gasto.importe)
                    det.referencia = cuenta.descripcion ?: cxp.proveedor.nombre
                    det.referencia2 = cxp.proveedor.nombre
                    poliza.addToPartidas(det)

                    //impuestos

                    BigDecimal ivaCfdi = gasto.ivaTrasladado

                    if(gasto.ivaRetenido){
                        ivaCfdi = gasto.ivaTrasladado - gasto.ivaRetenido
                    }

                    desc = "FAC: ${cxp.serie? cxp.serie : '' } ${cxp.folio} ${cxp.fecha} ${cxp.proveedor.nombre}"

                    def cheque = egreso.cheque

                    def ctaChe ="118-0002-0000-0000"
                    if(cheque && cheque.fecha.format('dd/MM/yyyy') != cheque.fechaTransito.format('dd/MM/yyyy') ){
                        ctaChe ="119-0002-0000-0000"
                    }

                    PolizaDet detIva = mapRow(ctaChe, desc, row, ivaCfdi)
                    detIva.referencia2 = cxp.proveedor.nombre
                    poliza.addToPartidas(detIva)

                    if(gasto.ivaRetenido > 0.0) {
                        BigDecimal imp = gasto.ivaRetenido
                        
                        def ctaCh1 = '118-0003-0000-0000'
                        def ctaCh2 = '213-0011-0000-0000'

                        if(cheque && cheque.fecha.format('dd/MM/yyyy') != cheque.fechaTransito.format('dd/MM/yyyy') ){
                            
                            ctaCh1 ="119-0003-0000-0000"
                            ctaCh2 ="216-0001-0000-0000"
                        }

                        poliza.addToPartidas(mapRow(ctaCh1, desc, row, imp))
                        poliza.addToPartidas(mapRow(ctaCh2, desc, row, 0.0, imp))
                    }

                }
            }else {
                BigDecimal importe = d.apagar
                desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) "
                if(importe > 0) {
                    PolizaDet detVale = mapRow(d.cuentaContable, desc, row, importe)
                    detVale.referencia2 = egreso.afavor
                    poliza.addToPartidas(detVale)
                } else {
                    PolizaDet detVale = mapRow(d.cuentaContable, desc, row, 0.0,  importe)
                    detVale.referencia2 = egreso.afavor 
                    poliza.addToPartidas(mapRow(d.cuentaContable, desc, row, 0.0,  importe))
                }
            }  
        }
        // buildComplementoDePago(row, egreso)
    }

    void abonoBanco(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        log.info('Abono a banco: {}', egreso)

        // Abono a Banco
        Map row = buildDataRow(egreso)
        row.asiento = "REM: ${r.concepto}"
       // buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        poliza.addToPartidas(mapRow(
                buildCuentaDeBanco(egreso),
                desc,
                row,
                0.0,
                egreso.importe.abs()))
    }



    def atenderGasto(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        r.partidas.each { d ->

            CuentaPorPagar cxp = d.cxp

            if(cxp){
                 String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                 " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
                row.uuid = cxp.uuid
                row.rfc = cxp.proveedor.rfc
                row.montoTotal = cxp.total
                row.moneda = cxp.moneda
                row.tipCamb = cxp.tipoDeCambio ?: 0.0
                row.referencia = cxp.nombre
                row.referencia2 = cxp.nombre

                

                def gastos = GastoDet.findAllByCxp(cxp)
                Boolean provision = false

                if(Periodo.obtenerMes(cxp.fecha) < Periodo.obtenerMes(egreso.fecha)){
                    provision = true
                }

                def cheque = egreso.cheque
                Boolean transito = false
                if(cheque && cheque.fecha.format('dd/MM/yyyy') != cheque.fechaTransito.format('dd/MM/yyyy') ){
                    transito = true
                }


                gastos.each{gasto -> 

                    def ctaGasto =gasto.cuentaContable
                    def gastoImporte = gasto.importe 

                    
                    if(provision){

                        CuentaOperativaProveedor co = CuentaOperativaProveedor.where{ proveedor == cxp.proveedor}.find()
                        if(!co) throw new RuntimeException("No existe cuenta operativa para el proveedor: ${cxp.proveedor}")
                        def ctaOperativa = co.getCuentaOperativa()
                        
                        switch(co.tipo) {
                            case 'GASTOS':
                                 ctaGasto = buscarCuenta("205-0006-${ctaOperativa}-0000")
                                 gastoImporte = gastoImporte + gasto.ivaTrasladado
                            break
                            case 'COMPRAS':
                                 ctaGasto = buscarCuenta("201-0002-${ctaOperativa}-0000")
                            break
                            case 'FLETES':
                                 ctaGasto = buscarCuenta("205-0004-${ctaOperativa}-0000")
                            break
                            case 'RELACIONADAS':
                                 ctaGasto = buscarCuenta("201-0001-${ctaOperativa}-0000")
                            break
                            case 'SEGUROS':
                                 ctaGasto = buscarCuenta("205-0003-${ctaOperativa}-0000")
                            break
                            case 'SOCIOS':
                                 ctaGasto = buscarCuenta("205-0008-${ctaOperativa}-0000")
                            break
                        }
                    }

                    poliza.addToPartidas(mapRow(ctaGasto, desc, row, gastoImporte))

                    def importeIva = gasto.ivaTrasladado

                    if(gasto.ivaRetenido){                  
                        importeIva = importeIva - gasto.ivaRetenido 
                    } 

                    if(gasto.ivaRetenido){
                        def ctaIvaRet1 = '118-0003-0000-0000'
                        def ctaIvaRet2 = '213-0011-0000-0000'
                        if( provision || transito ){
                            ctaIvaRet1 = '119-0003-0000-0000'
                            ctaIvaRet2 = '216-0001-0000-0000'
                        }

                        poliza.addToPartidas(mapRow(ctaIvaRet1, desc, row, gasto.ivaRetenido)) 
                        poliza.addToPartidas(mapRow(ctaIvaRet2, desc, row,0.00, gasto.ivaRetenido)) 
                        
                    } 
 
                    def ctaChe ='118-0002-0000-0000'

                    if(transito && ! provision){
                        ctaChe='119-0002-0000-0000'  
                        poliza.addToPartidas(mapRow(ctaChe, desc, row, importeIva)) 
                    }

                    if(!transito && ! provision){
                        poliza.addToPartidas(mapRow(ctaChe, desc, row, importeIva)) 
                    }

                    if(provision &&  ! transito){
                        poliza.addToPartidas(mapRow(ctaChe, desc, row, gasto.ivaTrasladado)) 
                        poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row,0.00, importeIva))  
                    } 

                    if(gasto.isrRetenido){
                        def ctaIvaRet = '213-0010-0000-0000'
                      
                        if(provision || transito){
                            ctaIvaRet = '216-0002-0000-0000'
                        }
                        poliza.addToPartidas(mapRow(ctaIvaRet, desc, row,0.00, gasto.isrRetenido))  
                    } 

                }

            }else {
              
                BigDecimal importe = d.apagar
                def desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) "
                if(importe > 0) {
                    def det1 = mapRow(d.cuentaContable, desc, row, importe)
                    det1.referencia = egreso.afavor
                     det1.referencia = egreso.afavor
                    poliza.addToPartidas(det1)
                } else {
                    def det2 = mapRow(d.cuentaContable, desc, row, 0.0,  importe)
                    det2.referencia = egreso.afavor
                    det2.referencia = egreso.afavor
                    poliza.addToPartidas(det2)
                }
                
            }  

        }
    }

    def atenderPorCuentaContableRembolso(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        Map row = [
                asiento: "REM: ${r.concepto}",
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        r.partidas.each{d ->
            row.referencia = d.cuentaContable.descripcion
            row.referencia2 = d.cuentaContable.descripcion
            CuentaContable cuenta = d.cuentaContable
            if(!cuenta) {
                throw new RuntimeException("No existe cuenta contable asignada al rembolso ${r.id}")
            }
            poliza.addToPartidas(mapRow(cuenta, desc, row, egreso.importe))
        }
    }

    def atenderPagoDeNomina(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        RembolsoDet det = r.partidas[0]

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${det.nombre} (${egreso.fecha.format('dd/MM/yyyy')})"
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${det.nombre}" +
                " (${r.egreso.fecha.format('dd/MM/yyyy')}) (REM: ${r.concepto})"
        Map row = [
                asiento: "REM: ${r.concepto}",
                referencia: det.nombre,
                referencia2: det.nombre,
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc
        CuentaContable cuenta = r.cuentaContable

        poliza.addToPartidas(mapRow(cuenta, desc, row, egreso.importe))

    }



    def atenderPagoFonacot(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            CuentaPorPagar cxp = d.cxp
            row.referencia = d.nombre
            row.referencia2 = d.nombre
            //row.uuid = cxp.uuid
            String ctaOperativa = d.comentario
            // CuentaContable cuenta = ctaPadre.subcuentas.find{it.clave.contains(ctaOperativa)}
            CuentaContable cuenta = d.cuentaContable
            if(!cuenta) throw new RuntimeException("No existe subcuenta ${d.comentario?: 'FALTA CO'} de ${ctaPadre.clave}")
            BigDecimal importe = d.apagar
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
            poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
        }
    }

    def atenderPagoSatImss(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso

        println "Pago SAT"

        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            
            BigDecimal importe = d.apagar
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) "
            if(importe > 0) {
                
                def det1 = mapRow(r.cuentaContable, desc, row, importe)
                det1.referencia = egreso.afavor
                det1.referencia = egreso.afavor
                poliza.addToPartidas(det1)
            } else {
                def det2 = mapRow(r.cuentaContable, desc, row, 0.0,  importe)
                det2.referencia = egreso.afavor
                det2.referencia = egreso.afavor
                poliza.addToPartidas(det2)
            }

        }
    }

    def atenderPagoFlete(Poliza poliza, Rembolso r) {
        log.info('Atendiendo pago de flete {}',r.egreso.id)
        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        log.info('Partidas {}', r.partidas.size())
        r.partidas.each { d ->

            CuentaPorPagar cxp = d.cxp
            if(cxp) {
                row.referencia = d.nombre
                row.referencia2 = d.nombre
                row.uuid = cxp.uuid
                row.rfc = cxp.proveedor.rfc
                row.montoTotal = cxp.total
                row.moneda = cxp.moneda
                row.tipCamb = cxp.tipoDeCambio

                CuentaOperativaProveedor co = CuentaOperativaProveedor.where{ proveedor == cxp.proveedor}.find()
                if(!co) throw new RuntimeException("No existe cuenta operativa para el proveedor: ${cxp.proveedor}")
                String ctaOperativa = co.getCuentaOperativa()
                log.info('Buscando subcuenta de{} de {}', ctaPadre.clave ,ctaOperativa)

                CuentaContable cuenta = ctaPadre.subcuentas.find{it.clave.contains(ctaOperativa)}

                BigDecimal importe = d.apagar
                BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva
                log.info('Iva: {}', ivaCfdi)

                String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "

                poliza.addToPartidas(mapRow(cuenta, desc, row, importe))

                poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
                poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, ivaCfdi))

                if(cxp.impuestoRetenidoIva > 0.0) {
                    BigDecimal imp = cxp.impuestoRetenidoIva
                    poliza.addToPartidas(mapRow('118-0003-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                    poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('213-0011-0000-0000', desc, row, 0.0, imp))
                }

            }else {
                BigDecimal importe = d.apagar
                def desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) "
                if(importe > 0) {
                    poliza.addToPartidas(mapRow(r.cuentaContable, desc, row, importe))
                } else {
                    poliza.addToPartidas(mapRow(r.cuentaContable, desc, row, 0.0,  importe))
                }
            }


        }
    }

    def atenderDividendosHonorarios(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso

        Map row = [
                asiento: "REM: ${r.concepto}",
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        row.referencia = r.cuentaContable.descripcion
        row.referencia2 = r.cuentaContable.descripcion
        CuentaContable cuenta = r.cuentaContable
        if(!cuenta) {
            throw new RuntimeException("No exister cuenta contable asignada al rembolso ${r.id}")
        }

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"

        poliza.addToPartidas(mapRow(cuenta, desc, row, egreso.importe))
        r.partidas.each { d ->
            String comentario = d.comentario
            if(comentario == '213-0009-0000-0000') {
                BigDecimal value =d.apagar
                value = MonedaUtils.round(value, 2)
                poliza.addToPartidas(mapRow('216-0003-0000-0000', desc, row, value))
                poliza.addToPartidas(mapRow('213-0009-0000-0000', desc, row, 0.0, value))
            }
        }

    }


    def atenderEspecial(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} " +
                " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "

        def det = r.partidas.find{it.cxp != null}
        if(det) {
            CuentaPorPagar cxp = det.cxp
            desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
            if(cxp) {
                row.referencia = cxp.nombre
                row.referencia2 = cxp.nombre
                row.uuid = cxp.uuid
                row.rfc = r.proveedor.rfc
                row.montoTotal = cxp.total
                row.moneda = cxp.moneda
                row.tipCamb = cxp.tipoDeCambio
            }
        }
        r.partidas.each { d ->

            CuentaContable cuenta = buscarCuenta(d.comentario)
            BigDecimal importe = d.apagar

            if(importe > 0.0)
                poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
            else
                poliza.addToPartidas(mapRow(cuenta, desc, row, 0.0, importe))
        }
    }

    def atenderEspecialMultiple(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso
        Map row = buildDataRow(egreso)
        Map<String, List<RembolsoDet>> grupos = r.partidas.groupBy {it.documentoFolio}
        grupos.each {
            String documento = it.getKey()
            List<RembolsoDet> partidas = it.value
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} " +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "

            def det = partidas.find{it.cxp != null}
            if(det) {
                CuentaPorPagar cxp = det.cxp
                desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio?: ''}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
                if(cxp) {
                    row.referencia = cxp.nombre
                    row.referencia2 = cxp.nombre
                    row.uuid = cxp.uuid
                    row.rfc = r.proveedor.rfc
                    row.montoTotal = cxp.total
                    row.moneda = cxp.moneda
                    row.tipCamb = cxp.tipoDeCambio ?: 1.0
                }
            }

            partidas.each { d ->

                CuentaContable cuenta = buscarCuenta(d.comentario)
                BigDecimal importe = d.apagar
                if(importe > 0.0)
                    poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
                else
                    poliza.addToPartidas(mapRow(cuenta, desc, row, 0.0, importe))

            }
        }
    }


     GastoDet findGasto (CuentaPorPagar cxp){
        def gastoDet = GastoDet.findByCxp(cxp)
        return gastoDet
     }
     
     Rembolso findRembolso(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        Rembolso r = Rembolso.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
    }


    
    PolizaDet mapRow(CuentaContable cuenta, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.uuid){
            asignarComprobanteNacional(det, row)
            det.tipCamb = row.tipCamb as BigDecimal
        }

        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }

        return det
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }

        return det
    }

    void ajustarConcepto(Poliza poliza, Rembolso r) {
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${r.egreso.afavor}" +
                " (${r.egreso.fecha.format('dd/MM/yyyy')}) (REM: ${r.id} ${r.concepto})"

    }

}
