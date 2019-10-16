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
import sx.cxp.GastoDet
import sx.utils.Periodo

@Slf4j
@Component
class PagoGastosReqTask implements  AsientoBuilder, EgresoTask {

    /**
     * Genera los asientos requreidos por la poliza
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    def generarAsientos(Poliza poliza, Map params = [:]) {

        println "Generando asiento para el gasto de Requisicion"+ poliza.egreso

        Requisicion r = findRequisicion(poliza)

         println "Generando asiento para el gasto de Requisicion "+ poliza.egreso

        log.info("Pago de GASTO: {}", r.egreso)

        ajustarConcepto(poliza, r)

        
        if(r.class.toString().contains('Compras')){
            cargoProveedor(poliza, r)
            registrarRetenciones(poliza, r)
        }else{
            cargoProveedorGasto(poliza, r)
        }

         abonoBanco(poliza, r)
        ajustarProveedorBanco(poliza)

        registrarVariacionCambiaria(poliza, r)
        registrarVariacionCambiariaIva(poliza, r)
    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     *
     * @param poliza
     * @param r
     */

    void cargoProveedorGasto(Poliza poliza, Requisicion r) {

        println "Generando el cargo al proveedor de gastos"

      
        MovimientoDeCuenta egreso = r.egreso
        List<RequisicionDet> partidas = r.partidas.sort {it.cxp.folio}

        partidas.each{
            CuentaPorPagar cxp = it.cxp

            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}"  +
                        " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                        " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"

  

            Map row = [
                    asiento: "PAGO_${egreso.tipo}",
                    referencia: r.proveedor.nombre,
                    referencia2: r.proveedor.nombre,
                    origen: egreso.id,
                    documento: cxp.folio,
                    documentoTipo: 'CXP',
                    documentoFecha: cxp.fecha,
                    sucursal: egreso.sucursal?: 'OFICINAS',
                    uuid: cxp.uuid,
                    rfc: cxp.proveedor.rfc,
                    montoTotal: cxp.total,
                    moneda: cxp.moneda,
                    tc: cxp.tipoDeCambio ? cxp.tipoDeCambio : 1.0
            ]

            def gastos = GastoDet.findAllByCxp(cxp)

                Boolean provision = false

                if(Periodo.obtenerMes(cxp.fecha) < Periodo.obtenerMes(egreso.fecha)){
                    provision = true
                }

                gastos.each{ gasto ->
                    println "ID: "+ gasto.id
                    desc = "FAC: ${cxp.serie? cxp.serie : '' } ${cxp.folio} ${cxp.fecha} ${gasto.descripcion}"
                    def cv = gasto.cuentaContable.clave
                    def totalGasto = gasto.importe
                    if(provision){
                       CuentaOperativaProveedor co = buscarCuentaOperativa(r.proveedor)
                       if(co){     
                           cv = "205-0006-${co.cuentaOperativa}-0000" 
                           if( co.tipo == 'RELACIONADAS'){
                               cv = "201-0001-${co.cuentaOperativa}-0000" 
                           }
                           if(co.tipo == 'SEGUROS'){
                               cv = "205-0003-${co.cuentaOperativa}-0000" 
                           }
                           if(co.tipo == 'FLETES'){
                               cv = "205-0004-${co.cuentaOperativa}-0000" 
                           }
                       }
                        totalGasto = gasto.importe + gasto.ivaTrasladado - gasto.ivaRetenido - gasto.isrRetenido
                    }
               
                poliza.addToPartidas(mapRow(cv, desc, row, totalGasto))

                // Impuestos

                def cheque = egreso.cheque
                Boolean transito = false
                if(cheque && cheque.fecha.format('dd/MM/yyyy') != cheque.fechaTransito.format('dd/MM/yyyy') ){
                    transito = true
                }


                desc = "FAC: ${cxp.serie? cxp.serie : '' } ${cxp.folio} ${cxp.fecha} ${cxp.proveedor.nombre}"
            
                //BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva

                 def importeIva = gasto.ivaTrasladado

                    if(gasto.ivaRetenido){                  
                        importeIva = importeIva - gasto.ivaRetenido 
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

                    if(gasto.isrRetenido){
                        def ctaIvaRet = '213-0010-0000-0000'
                      
                        if(provision || transito){
                            ctaIvaRet = '216-0002-0000-0000'
                        }
                        poliza.addToPartidas(mapRow(ctaIvaRet, desc, row,0.00, gasto.isrRetenido))  
                    } 


            }
      
        }
    }


    void cargoProveedor(Poliza poliza, Requisicion r) {
        CuentaOperativaProveedor co = buscarCuentaOperativa(r.proveedor)
        log.info('Cuenta Operativa: {}', co)
        MovimientoDeCuenta egreso = r.egreso
        List<RequisicionDet> partidas = r.partidas.sort {it.cxp.folio}
        partidas.each {
            CuentaPorPagar cxp = it.cxp
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"
            Map row = [
                    asiento: "PAGO_${egreso.tipo}",
                    referencia: r.proveedor.nombre,
                    referencia2: r.proveedor.nombre,
                    origen: egreso.id,
                    documento: cxp.folio,
                    documentoTipo: 'CXP',
                    documentoFecha: cxp.fecha,
                    sucursal: egreso.sucursal?: 'OFICINAS',
                    uuid: cxp.uuid,
                    rfc: cxp.proveedor.rfc,
                    montoTotal: cxp.total,
                    moneda: cxp.moneda,
                    tc: cxp.tipoDeCambio ? cxp.tipoDeCambio : 1.0
            ]
            buildComplementoDePago(row, egreso)

            // Cargo a Proveedor
           // String cv = "205-0006-${co.cuentaOperativa}-0000"

            String cv =  "201-0002-${co.cuentaOperativa}-0000"

            if(co.tipo == 'COMPRAS') {
                cv = "201-0002-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'RELACIONADAS') {
                cv = "205-0009-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'RELACIONADAS' && (co.cuentaOperativa == '0038' || co.cuentaOperativa == '0061')) {
                cv = "201-0001-${co.cuentaOperativa}-0000"
            }
            /* if(co.tipo == 'FLETES') {
                cv = "205-0004-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'SEGUROS') {
                cv = "205-0003-${co.cuentaOperativa}-0000"
            } */

            if(['0038','0061'].contains(co.cuentaOperativa)) {
                cv = "201-0001-${co.cuentaOperativa}-0000"
            }

            BigDecimal total = MonedaUtils.round(it.cxp.total  * it.cxp.tipoDeCambio)

            if(['0331','0380'].contains(co.cuentaOperativa)) {
                total = it.cxp.total
            }



            poliza.addToPartidas(mapRow(cv, desc, row, total))


            BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva
            BigDecimal dif = cxp.total -it.apagar

            def iva119 = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva

              if(dif.abs() > 3.00) {
                    BigDecimal ii = MonedaUtils.calcularImporteDelTotal(it.apagar)
                    ivaCfdi = MonedaUtils.calcularImpuesto(ii)
                    
                    BigDecimal iii = MonedaUtils.calcularImporteDelTotal(cxp.total * cxp.tipoDeCambio)
                    iva119 = MonedaUtils.calcularImpuesto(iii) 
                }

            def cheque = egreso.cheque
            
            if(cheque && cheque.fecha.format('dd/MM/yyyy') == cheque.fechaTransito.format('dd/MM/yyyy') ){
                log.info("Fecha  Ceque {} and  {}",cheque.fecha.format('dd/MM/yyyy'), cheque.fechaTransito.format('dd/MM/yyyy'))
                 poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
                 poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, iva119))
            }
            if(!cheque){
                log.info('No tiene cheque')
                poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
                poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, ivaCfdi))
            }
        }
    }

    void abonoBanco(Poliza poliza, Requisicion r) {

     
        MovimientoDeCuenta egreso = r.egreso

        // Abono a Banco

        def prebanco= '102'

        if(egreso.cuenta.tipo == 'INVERSION'){
            prebanco = '103'
        }

        String ctaBanco = "${prebanco}-${egreso.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${egreso.cuenta.subCuentaOperativa}-0000"
        // log.info('Cta de banco: {}, {} MXN: {}', ctaBanco, egreso.moneda, egreso.moneda == 'MXN')
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: r.nombre,
                referencia2:r.proveedor.nombre,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        buildComplementoDePago(row, egreso)
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        if(r.moneda != 'MXN') {
            desc = desc + " TC: ${r.tipoDeCambio}"
        }

        
        poliza.addToPartidas(mapRow(ctaBanco, desc, row, 0.0, egreso.importe.abs()))
    }

    void registrarRetenciones(Poliza poliza, Requisicion r) {
        MovimientoDeCuenta egreso = r.egreso
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: r.nombre,
                referencia2: r.proveedor.nombre,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        buildComplementoDePago(row, egreso)
        String desc2 = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "

        r.partidas.each {
            if(it.cxp.impuestoRetenido > 0) {

                CuentaPorPagar cxp = it.cxp
                String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                        " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"

                def cheque = egreso.cheque
                 if(cheque && cheque.fecha.format('dd/MM/yyyy') == cheque.fechaTransito.format('dd/MM/yyyy') ){
                    if(cxp.impuestoRetenidoIva > 0.0) {
                        BigDecimal imp = cxp.impuestoRetenidoIva
                        poliza.addToPartidas(mapRow('118-0003-0000-0000', desc, row, imp))
                       // poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                      //  poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                        poliza.addToPartidas(mapRow('213-0011-0000-0000', desc, row, 0.0, imp))
                    }
                    if(cxp.impuestoRetenidoIsr > 0.0) {
                        BigDecimal imp = cxp.impuestoRetenidoIsr
                     //   poliza.addToPartidas(mapRow('216-0002-0000-0000', desc, row, imp))
                        poliza.addToPartidas(mapRow('213-0010-0000-0000', desc, row, 0.0, imp))
                    }
                 }else{
                     if(cxp.impuestoRetenidoIva > 0.0) {
                        BigDecimal imp = cxp.impuestoRetenidoIva
                        poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, imp))
                       // poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                      //  poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                        poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, 0.0, imp))
                    }
                 }
                 if (!cheque) {
                     if(cxp.impuestoRetenidoIva > 0.0) {
                        BigDecimal imp = cxp.impuestoRetenidoIva
                        poliza.addToPartidas(mapRow('118-0003-0000-0000', desc, row, imp))
                      //  poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                      //  poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                        poliza.addToPartidas(mapRow('213-0011-0000-0000', desc, row, 0.0, imp))
                    }
                    if(cxp.impuestoRetenidoIsr > 0.0) {
                        BigDecimal imp = cxp.impuestoRetenidoIsr
                      //  poliza.addToPartidas(mapRow('216-0002-0000-0000', desc, row, imp))
                        poliza.addToPartidas(mapRow('213-0010-0000-0000', desc, row, 0.0, imp))
                    }
                 }

                

            }
        }
    }

    /**
     * Asientos requeridos para registrar la diferencia cambiaria
     *
     * @param poliza
     * @param r
     */

    void ajustarConcepto(Poliza poliza, Requisicion r) {
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${r.egreso.afavor} (${r.egreso.fecha.format('dd/MM/yyyy')}) (${r.egreso.tipo})"
        if(r.moneda != 'MXN') {
            poliza.concepto = poliza.concepto + "TC: ${r.egreso.tipoDeCambio}"
        }
    }

    Requisicion findRequisicion(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        Requisicion r = Requisicion.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
    }

    CuentaOperativaProveedor buscarCuentaOperativa(Proveedor p) {
        CuentaOperativaProveedor co = CuentaOperativaProveedor.where{proveedor == p}.find()
        if(!co) throw new RuntimeException("Proveedor ${p.nombre} sin cuenta operativa")
        return co
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

            println "Desc: "+descripcion

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion:   descripcion,
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
        if(row.metodoDePago)
            asignarComplementoDePago(det, row)
        return det
    }

    @CompileDynamic
    void ajustarProveedorBanco(Poliza poliza) {
        PolizaDet abonoBanco = poliza.partidas.find {it.cuenta.clave.startsWith('102')}

        if(poliza.partidas.find {it.cuenta.clave.startsWith('103')}){
            abonoBanco = poliza.partidas.find {it.cuenta.clave.startsWith('103')}
        }       
         
        List<PolizaDet> provs = poliza.partidas.findAll{ it.cuenta.clave.startsWith('201') || it.cuenta.clave.startsWith('205')}
        def debe = provs.sum 0.0, {it.debe}

        def dif = abonoBanco.haber - debe
        // log.info('Debe: {}', debe)
        //  log.info('Cuadre especial por: {}', dif)

        if(dif.abs() > 0.0 &&  dif.abs() <= 5.0){

            def det = abonoBanco

            if(dif < 0.0) {

                PolizaDet pdet = new PolizaDet()
                pdet.cuenta = buscarCuenta('704-0005-0000-0000')
                pdet.concepto = pdet.cuenta.descripcion
                pdet.sucursal = det.sucursal
                pdet.origen = det.origen
                pdet.referencia = det.referencia
                pdet.referencia2 = det.referencia2
                pdet.haber = dif.abs()
                pdet.descripcion = det.descripcion
                pdet.entidad = det.entidad
                pdet.asiento = det.asiento+ '_OPRD'
                pdet.documentoTipo = det.documentoTipo
                pdet.documentoFecha = det.documentoFecha
                pdet.documento = det.documento

                poliza.addToPartidas(pdet)

            } else {
                PolizaDet pdet = new PolizaDet()
                pdet.cuenta = buscarCuenta('703-0001-0000-0000')
                pdet.concepto = pdet.cuenta.descripcion
                pdet.sucursal = det.sucursal
                pdet.origen = det.origen
                pdet.referencia = det.referencia
                pdet.referencia2 = det.referencia2
                pdet.debe = dif.abs()
                pdet.descripcion = det.descripcion
                pdet.entidad = det.entidad
                pdet.asiento = det.asiento+ '_OGST'
                pdet.documentoTipo = det.documentoTipo
                pdet.documentoFecha = det.documentoFecha
                pdet.documento = det.documento
                poliza.addToPartidas(pdet)
            }
        }

    }
    
    def registrarVariacionCambiaria(Poliza p, Requisicion requisicion) {

      

        requisicion.partidas.each{ det ->
            def cxp = det.cxp
            if(cxp.moneda != requisicion.moneda){
                def importeOriginal = cxp.total * cxp.tipoDeCambio
                def importeActualizado = det.apagar 
                def dif = importeOriginal - importeActualizado 
                // log.info("Ori: {} Act: {}  {}",importeOriginal,importeActualizado,cxp.total)

                if(dif > 0.0) {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('702-0004-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.id
                    pdet.referencia = requisicion.nombre
                    pdet.referencia2 = requisicion.nombre
                    pdet.haber = dif.abs()
                    pdet.descripcion = p.concepto
                    pdet.entidad = 'Requisicion'
                    pdet.asiento = 'Variacion Cambiaria'
                    pdet.documentoTipo = cxp.tipo
                    pdet.documentoFecha = cxp.fecha
                    pdet.documento = cxp.folio
                    pdet.moneda = requisicion.moneda
                    pdet.tipCamb = requisicion.tipoDeCambio
                    p.addToPartidas(pdet)

                } else {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('701-0001-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.id
                    pdet.referencia = requisicion.nombre
                    pdet.referencia2 = requisicion.nombre
                    pdet.debe = dif.abs()
                    pdet.descripcion = p.concepto
                    pdet.entidad = 'Requisicion'
                    pdet.asiento = 'Variacion Cambiaria'
                    pdet.documentoTipo = cxp.tipo
                    pdet.documentoFecha = cxp.fecha
                    pdet.documento = cxp.folio
                    pdet.moneda = requisicion.moneda
                    pdet.tipCamb = requisicion.tipoDeCambio
                    p.addToPartidas(pdet)
                }

            }
        }

    }

    def registrarVariacionCambiariaIva(Poliza p, Requisicion requisicion) {

        requisicion.partidas.each{ det ->
            def cxp = det.cxp
            if(cxp.moneda != requisicion.moneda){

                BigDecimal ii = MonedaUtils.calcularImporteDelTotal(cxp.total * cxp.tipoDeCambio)
                def ivaCxp = MonedaUtils.calcularImpuesto(ii) 
                
                BigDecimal iii = MonedaUtils.calcularImporteDelTotal(det.apagar * requisicion.tipoDeCambio)
                def ivaPago = MonedaUtils.calcularImpuesto(iii) 
            
                def dif = ivaCxp - ivaPago
                log.info("Cxp: {} Pago: {}  {}",ivaCxp,ivaPago, dif)


                if(dif < 0){
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('702-0004-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.id
                    pdet.referencia = requisicion.nombre
                    pdet.referencia2 = requisicion.nombre
                    pdet.haber = dif.abs()
                    pdet.descripcion =  p.concepto
                    pdet.entidad = 'Requisicion'
                    pdet.asiento = 'Variacion Cambiaria'
                    pdet.documentoTipo = cxp.tipo
                    pdet.documentoFecha = cxp.fecha
                    pdet.documento = cxp.folio
                    pdet.moneda = requisicion.moneda
                    pdet.tipCamb = requisicion.tipoDeCambio
                    p.addToPartidas(pdet)
                } else {
                     PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('701-0001-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.id
                    pdet.referencia = requisicion.nombre
                    pdet.referencia2 = requisicion.nombre
                    pdet.debe = dif.abs()
                    pdet.descripcion =  p.concepto
                    pdet.entidad = 'Requisicion'
                    pdet.asiento = 'Variacion Cambiaria'
                    pdet.documentoTipo = cxp.tipo
                    pdet.documentoFecha = cxp.fecha
                    pdet.documento = cxp.folio
                    pdet.moneda = requisicion.moneda
                    pdet.tipCamb = requisicion.tipoDeCambio
                    p.addToPartidas(pdet)
                }
            }

        }
    }

}
