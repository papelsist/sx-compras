package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.CuentaOperativaProveedor
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.contabilidad.ProcesadorDePoliza
import sx.core.Proveedor
import sx.core.Sucursal
import sx.cxp.ConceptoDeGasto
import sx.cxp.CuentaPorPagar
import sx.cxp.GastoDet

import sx.cxp.RembolsoDet
import sx.cxp.RequisicionDet
import sx.utils.MonedaUtils

@Slf4j
@Component
class ProvisionDeGastosProc implements  ProcesadorDePoliza, AsientoBuilder {

    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE GASTOS ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        ajustar(poliza, [:])
        return poliza
    }



     def generarAsientos(Poliza poliza, Map params) {

        String query = getQuery()

        def rows = getAllRows(query,[poliza.ejercicio,poliza.mes,poliza.ejercicio,poliza.mes])

        rows.each{row ->

            CuentaPorPagar cxp = CuentaPorPagar.get(row.cxpId)

            String desc = " F: ${cxp.folio} ${cxp.fecha} "
            def gastos = GastoDet.findAllByCxp(cxp)
            gastos.each{gasto ->

                desc = " F: ${cxp.folio} ${cxp.fecha} ${gasto.sucursal.nombre} "
                PolizaDet det = build(cxp, gasto.cuentaContable, desc, gasto.sucursal.nombre, gasto.importe)
                poliza.addToPartidas(det)

                 if(gasto.ivaTrasladado){
                    def importeIva = gasto.ivaTrasladado

                    if(gasto.ivaRetenido){                  
                        importeIva = importeIva - gasto.ivaRetenido
                        
                    } 

                    CuentaContable ctaIva = buscarCuenta('119-0002-0000-0000')
                    PolizaDet detIvaT =  build(cxp, ctaIva, desc, gasto.sucursal.nombre, importeIva)
                    poliza.addToPartidas(detIvaT)
                 }

                if(gasto.ivaRetenido){
                    CuentaContable ivaRetenido = buscarCuenta('119-0003-0000-0000')
                    PolizaDet detIvaRet = build(cxp, ivaRetenido, desc, gasto.sucursal.nombre, gasto.ivaRetenido)
                    poliza.addToPartidas(detIvaRet)

                    CuentaContable ivaRetPend = buscarCuenta('216-0001-0000-0000')
                    PolizaDet detIvaRetPend = build(cxp, ivaRetPend, desc, gasto.sucursal.nombre,0.00, gasto.ivaRetenido)
                    poliza.addToPartidas(detIvaRetPend)
                } 
            }

             if(gastos){

                
                CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
                 def cv = '205-0006'
                if(co.tipo == 'FLETES'){
                    cv = '205-0004'
                }
                if(co.tipo == 'SEGUROS'){
                    cv = '205-0003'
                } 

                  if(co.tipo == 'RELACIONADAS'){
                    cv = '201-0001'
                }

                CuentaContable ctaProv = buscarCuenta("${cv}-${co.cuentaOperativa}-0000")
                // CuentaContable ctaProv = buscarCuenta("205-0006-0000-0000")
              
                def totalCxp = cxp.total
            
                PolizaDet cxpDet = build(cxp, ctaProv, desc, 'OFICINAS',0.00, totalCxp)
                poliza.addToPartidas(cxpDet) 
            }
           
            
        }

     }

     def ajustar(Poliza p, Map params){
          def grupos = p.partidas.findAll().groupBy { it.uuid }

        grupos.each {
            
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}
            BigDecimal dif = debe - haber

            if(dif.abs() > 0.00 && dif.abs()<= 1.00){
                log.info("Registrando Diferencias")

                def det = it.value.find {it.cuenta.clave.startsWith('600')}

                if(dif > 0.0) {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('704-0005-0000-0000')
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.haber = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)

                } else {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('703-0001-0000-0000')
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.debe = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)
                }
            }

        }

     }

    def generarAsientosOld(Poliza poliza, Map params) {

        List<RequisicionDet> requisiciones = RequisicionDet
                .findAll("from RequisicionDet d where date(d.cxp.fecha) = ? and d.cxp.tipo = 'GASTOS'",
                [poliza.fecha])
        log.info('Partidas de requisicion: {}', requisiciones.size())
        requisiciones.each { req ->
            CuentaPorPagar cxp = req.cxp
            CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
            log.info('GASTO COP: {}', co)
            if(co.tipo == 'GASTOS' || co.tipo == 'RELACIONADAS'){
                cargoGasto(poliza, cxp, 'OFICINAS')
                abonoProveedorGasto(poliza, cxp, 'OFICINAS')
            }
        }

        List<RembolsoDet> rembolsos = RembolsoDet
                .findAll("from RembolsoDet d where date(d.cxp.fecha) = ? and d.rembolso.concepto <> 'REMBOLSO'",
                [poliza.fecha])
        log.info('Facturas en rembolsos: {} Fecha: {}', rembolsos.size(), poliza.fecha)
        rembolsos.each { r ->
            CuentaPorPagar cxp = r.cxp
            if(cxp.tipo != 'HONORARIOS') {
                CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
                log.info('REMBOLSO: {} COP: {} {}', r.rembolso.id, co, r.comentario)
                if(co.tipo !='FLETES' &&  co.tipo !='SEGUROS'){
                    String suc = r.rembolso.sucursal.nombre
                    cargoGasto(poliza, cxp, suc)
                    abonoProveedorGastoRembolso(poliza, cxp, r)
                }
            } else if(cxp.tipo == 'HONORARIOS'){
                log.info('CXP: {}',cxp )
                cargoGastoHonorarios(poliza, cxp, r)
                abonoHonorarios(poliza, cxp, r)

            }
        }

        def incluir = ['GASTO', 'ESPECIAL']
        List<RembolsoDet> rembolsosNoDeducibles = RembolsoDet
                .findAll("from RembolsoDet d where date(d.rembolso.egreso.fecha) = ? and d.cxp is null and d.rembolso.concepto <> 'REMBOLSO'",
                [poliza.fecha])
        rembolsosNoDeducibles.each { r ->

            if(incluir.contains(r.rembolso.concepto)) {
                Proveedor proveedor = r.rembolso.proveedor
                if(proveedor) {
                    CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(proveedor)
                    // log.info('Proveedor: {}', co)
                    if(co.tipo != 'SEGUROS') {
                        cargoNoDeducible(poliza, r)
                        abonoNoDeducible(poliza, r)
                    }
                } else {
                    cargoNoDeducible(poliza, r)
                    abonoNoDeducible(poliza, r)
                }
            }

        }

        poliza.validate()
        poliza = poliza.save failOnError: true, flush: true
        return poliza
    }


    def cargoGasto(Poliza poliza, CuentaPorPagar cxp, String suc) {

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
            ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''} 
        """

        def cfdi = cxp.comprobanteFiscal
        def cta = CuentaContable.where{clave == '600-0000-0000-0000'}.find()
        def sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()

        log.info('CXP:{} Folio:{} CfdiId:{}', cxp.nombre, cxp.folio, cxp.comprobanteFiscal.id)
        if(cfdi.conceptos) {
            def gasto = cfdi.conceptos.first()

            if(gasto.conceptos) {
                def con = gasto.conceptos.first()
                validarCuentaContable(con)
                cta = con.cuentaContable
                sucursal = con.sucursal
            }
        }

        PolizaDet det = build(cxp, cta, desc, sucursal.nombre, cfdi.subTotal)
        poliza.addToPartidas(det)



        def impuestoNeto = (cxp.impuestoTrasladado ?: 0.00) - (cxp.impuestoRetenidoIva ?: 0.00)

        CuentaContable ivaPendiente = buscarCuenta('119-0002-0000-0000')
        poliza.addToPartidas(build(cxp, ivaPendiente, desc, suc, impuestoNeto ))


        if(cxp.impuestoRetenidoIva > 0.0) {
           
            CuentaContable ivaRet2 = buscarCuenta('119-0003-0000-0000')
            CuentaContable ivaRet3 = buscarCuenta('216-0001-0000-0000')
            
            poliza.addToPartidas(build(cxp,ivaRet2, desc, suc, cxp.impuestoRetenidoIva))

            poliza.addToPartidas(build(cxp,ivaRet3, desc, suc,0.00, cxp.impuestoRetenidoIva))
            
        }
        if(cxp.impuestoRetenidoIsr > 0.0) {

            CuentaContable ivaIsr1 = buscarCuenta('216-0002-0000-0000')
            BigDecimal imp = cxp.impuestoRetenidoIsr
            poliza.addToPartidas(build(cxp,ivaIsr1, desc, suc,0.00, cxp.impuestoRetenidoIsr))
       
        }

    }


    def abonoHonorarios(Poliza poliza, CuentaPorPagar cxp, RembolsoDet rembolsoDet) {

        def cfdi = cxp.comprobanteFiscal

        String desc = """
            
            F:${cxp.serie?:''} ${cxp.folio?: ''} (${cxp.fecha.format('dd/MM/yyyy')})
            ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''} 
        """



        def sclave = rembolsoDet.comentario
        def cta = CuentaContable.where{clave == sclave}.find()
        log.info('Clave: {} Cta: {} ', sclave,cta)
        def sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        if(cta == null) {
            cta = CuentaContable.where{clave == '600-0004-0000-0000'}.find()
        }

        poliza.addToPartidas(build(
                cxp,
                buscarCuenta('216-0003-0000-0000'),
                desc,
                sucursal.nombre,
                0.0,
                cfdi.descuento)
        )

        PolizaDet det = build(cxp, cta, desc, sucursal.nombre, 0.0, rembolsoDet.rembolso.apagar)
        poliza.addToPartidas(det)



    }

    def cargoGastoHonorarios(Poliza poliza, CuentaPorPagar cxp, RembolsoDet rembolsoDet) {

        Sucursal sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
        """
        def cfdi = cxp.comprobanteFiscal
        CuentaContable cuenta = buscarCuenta('600-P036-0000-0000')
        BigDecimal total = rembolsoDet.apagar
        poliza.addToPartidas(build(cxp,cuenta,desc, sucursal.nombre,  total ))

    }

    def abonoProveedorGasto(Poliza poliza, CuentaPorPagar cxp,  String suc) {

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
        """
        CuentaContable cuenta
        String cv = resolverClaveDeCuenta(cxp)
        cuenta = buscarCuenta(cv)
        BigDecimal total = cxp.total
        poliza.addToPartidas(build(cxp,cuenta,desc, suc, 0.0, total ))
    }

    def abonoProveedorGastoRembolso(Poliza poliza, CuentaPorPagar cxp,  RembolsoDet rembolsoDet) {

        Sucursal sucursal = rembolsoDet.rembolso.sucursal

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
        """
        CuentaContable cuenta
        String cv = resolverClaveDeCuenta(cxp)
        if(cv) {
            cuenta = buscarCuenta(cv)
        } else {
            cuenta = buscarCuenta('205-0006-0999-0000')
            
        }

        if(rembolsoDet.rembolso.concepto == 'REMBOLSO') {
            cv = "101-0002-${sucursal.clave.padLeft(4, '0')}-0000"
            cuenta = buscarCuenta(cv)
        } 

        BigDecimal total = cxp.total
        poliza.addToPartidas(build(cxp,cuenta,desc, sucursal.nombre, 0.0, total ))
    }


    def cargoNoDeducible(Poliza poliza,  RembolsoDet det) {
        Sucursal suc = det.rembolso.sucursal
        String desc = """
            Docto:${det.documentoSerie?:''} ${det.documentoFolio?:''} (${det.documentoFecha?.format('dd/MM/yyyy')})
        """
        def cv = "600-0031-${suc.clave.padLeft(4, '0')}-0000"


        if(det.rembolso.proveedor && det.rembolso.proveedor.rfc == 'AEC810901298') {

            cv = "600-0014-${suc.clave.padLeft(4, '0')}-0000"
            if(det.comentario && det.comentario.startsWith('118')) {
                def clave = det.comentario.replaceAll('118', '119')
                cv = clave
            }
        }
        CuentaContable cta = buscarCuenta(cv)

        PolizaDet polizaDet = new PolizaDet()

        polizaDet.with {
            cuenta = cta
            concepto = cta.descripcion
            descripcion = desc
            asiento =  "PROVISION_DE_REMBOLSO"
            referencia =  det.rembolso.nombre
            referencia2 = det.rembolso.nombre
            origen =  det.rembolso.id.toString()
            documento =  det.rembolso.id.toString()
            documentoTipo =  'REMBOLSO'
            documentoFecha =  det.rembolso.fecha
            sucursal =  suc.nombre
            debe = det.apagar.abs()
            haber = 0.00
        }
        poliza.addToPartidas(polizaDet)
    }

    def abonoNoDeducible(Poliza poliza, RembolsoDet det) {
        Sucursal suc = det.rembolso.sucursal
        String desc = """
            Dcto:${det.documentoSerie?:''} ${det.documentoFolio?:''} (${det.documentoFecha?.format('dd/MM/yyyy')})
        """
        CuentaContable  cta = buscarCuenta("205-0006-0999-0000")
        if(det.rembolso.proveedor && det.rembolso.proveedor.rfc == 'AEC810901298') {
            cta = buscarCuenta("107-0009-0011-0000")
        }

        PolizaDet polizaDet = new PolizaDet()

        polizaDet.with {
            cuenta = cta
            concepto = cta.descripcion
            descripcion = desc
            asiento =  "PROVISION_DE_REMBOLSO"
            referencia =  det.rembolso.nombre
            referencia2 = det.rembolso.nombre
            origen =  det.rembolso.id.toString()
            documento =  det.rembolso.id.toString()
            documentoTipo =  'REMBOLSO'
            documentoFecha =  det.rembolso.fecha
            sucursal =  suc.nombre
            debe =  0.00
            haber = det.apagar.abs()
        }
        poliza.addToPartidas(polizaDet)
    }


    private PolizaDet build(CuentaPorPagar  cxp,
                            CuentaContable cta,
                            String desc,
                            String suc,
                            BigDecimal deb = 0.0,
                            BigDecimal hab = 0.0) {

        PolizaDet det = new PolizaDet()
        det.with {
            cuenta = cta
            concepto = cta.descripcion
            descripcion = desc
            asiento =  "PROVISION_DE_GASTO"
            referencia =  cxp.proveedor.nombre
            referencia2 =cxp.proveedor.nombre
            origen =  cxp.id
            documento =  cxp.folio
            documentoTipo =  'CXP'
            documentoFecha =  cxp.fecha
            sucursal =  suc
            uuid =  cxp.uuid
            rfc =  cxp.proveedor.rfc
            montoTotal = cxp.total
            moneda = cxp.moneda
            tipCamb = cxp.tipoDeCambio
            debe = deb
            haber = hab
        }
        return det
    }

    private String resolverClaveDeCuenta(CuentaPorPagar cxp) {

        CuentaOperativaProveedor co = buscarCuentaOperativa(cxp.proveedor)
        if(co == null) return null
        // Cargo a Proveedor
        String cv = "205-0006-${co.cuentaOperativa}-0000"

        if(co.tipo == 'COMPRAS') {
            cv = "201-0002-${co.cuentaOperativa}-0000"
        }
        if(co.tipo == 'RELACIONADAS') {
            cv = "205-0009-${co.cuentaOperativa}-0000"
        }
        if(co.tipo == 'RELACIONADAS' && (co.cuentaOperativa == '0038' || co.cuentaOperativa == '0061')) {
            cv = "201-0001-${co.cuentaOperativa}-0000"
        }
        if(co.tipo == 'FLETES') {
            cv = "205-0004-${co.cuentaOperativa}-0000"
        }
        if(co.tipo == 'SEGUROS') {
            cv = "205-0003-${co.cuentaOperativa}-0000"
        }
        if(['0038','0061'].contains(co.cuentaOperativa)) {
            cv = "201-0001-${co.cuentaOperativa}-0000"
        }
        return cv
    }

    CuentaOperativaProveedor buscarCuentaOperativa(Proveedor p) {
        CuentaOperativaProveedor co = CuentaOperativaProveedor.where{proveedor == p}.find()

        return co
    }

    private validarCuentaContable(ConceptoDeGasto con) {
        if(con.cuentaContable == null) {
            con.cuentaContable = buscarCuenta('600-0000-0000-0000')
            /*
            throw new RuntimeException("""
            No existe cuenta contable asignada a la partida  (concepto de gasto) por: ${con.importe}
            XML: ${con.cfdiDet.comprobante.uuid}
            """)
            */
        }
    }


    String getQuery() {
        String query = """           
            SELECT 
                c.id as cxpId
            FROM 
                cuenta_por_pagar c join requisicion_det d on(d.cxp_id=c.id) join 
                requisicion r on(d.requisicion_id=r.id) join 
                movimiento_de_cuenta m on(r.egreso=m.id)
            WHERE  
                c.fecha>='2019-01-01' and c.tipo='GASTOS' and month(m.fecha)>month(c.fecha) and year(c.fecha)=? and month(c.fecha)=?
            UNION
            SELECT 
                c.id as cxpId
            FROM 
                cuenta_por_pagar c join 
                rembolso_det d on(d.cxp_id=c.id) join
                rembolso r on(d.rembolso_id=r.id) join 
                movimiento_de_cuenta m on(r.egreso_id=m.id)
            WHERE 
                c.fecha>='2019-01-01' and c.tipo='GASTOS' and r.concepto='GASTOS' and month(m.fecha)>month(c.fecha) and year(c.fecha)=? and month(c.fecha)=?
        """
        return query
    }


}
