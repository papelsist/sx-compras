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

import sx.cxp.RembolsoDet
import sx.cxp.RequisicionDet
import sx.utils.MonedaUtils

@Slf4j
@Component
class ProvisionDeSegurosProc implements  ProcesadorDePoliza, AsientoBuilder {
    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE GASTOS ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    def generarAsientos(Poliza poliza, Map params) {
    
    List<RequisicionDet> requisiciones = RequisicionDet
                .findAll("from RequisicionDet d where date(d.cxp.fecha) = ? and d.cxp.tipo = 'GASTOS'",
                [poliza.fecha])
        requisiciones.each { req ->
            CuentaPorPagar cxp = req.cxp
            CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
            if(co){
                if(co.tipo == 'SEGUROS'){
                    cargoGasto(poliza, cxp, 'OFICINAS')
                    log.info('REQUISICION: {}', req.requisicion.folio)
                    abonoProveedorGasto(poliza, cxp, 'OFICINAS')
                }
            }  
        }

    List<RembolsoDet> rembolsos = RembolsoDet
                .findAll("from RembolsoDet d where date(d.cxp.fecha) = ? ",
                [poliza.fecha])
        rembolsos.each { r ->
            if(r.cxp ){
                CuentaPorPagar cxp = r.cxp
                CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
                if(co){
                    if(co.tipo == 'SEGUROS'){
                        log.info('REMBOLSO {} : {} {}', r.rembolso.concepto, r.rembolso.id, r.comentario)
                        String suc = r.rembolso.sucursal.nombre
                        cargoGasto(poliza, cxp, suc)
                        abonoProveedorGastoRembolso(poliza, cxp, r)
                    }
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
        // NEW WAY
        log.info('CXP:{} Folio:{} CfdiId:{}', cxp.nombre, cxp.folio, cxp.comprobanteFiscal.id)
        if(!cfdi.conceptos) {
            throw new RuntimeException("XML sin partidas UUID: ${cfdi.uuid}  CFDI_ID: ${ cfdi.id}")
        }
        def gasto = cfdi.conceptos.first()
        if(!gasto.conceptos) {
            throw new RuntimeException("XML sin CONCEPTO DE GASTOS UUID: ${cfdi.uuid}  CFDI_ID: ${ cfdi.id}")
        }
        def con = gasto.conceptos.first()
        validarCuentaContable(con)
        def impt = cfdi.subTotal - (cfdi.descuento?: 0.0)
        CuentaContable cuenta = buscarCuenta("${con.cuentaContable.clave.substring(0,9)}${con.sucursal.clave.padLeft(4,'0')}-0000")
        PolizaDet det = build(cxp, cuenta, desc, con.sucursal.nombre, impt)
        poliza.addToPartidas(det)

        /* OLD WAY
        cfdi.conceptos.each { gasto ->
            gasto.conceptos.each { con ->
                validarCuentaContable(con)
                CuentaContable cuenta = buscarCuenta("${con.cuentaContable.clave.substring(0,9)}${con.sucursal.clave.padLeft(4,'0')}-0000")
                def importe = con.importe
                def descuento = gasto.descuento ?: 0.0
                if(descuento > 0.0){
                    importe = importe - descuento
                }
                PolizaDet det = build(cxp, cuenta, desc, con.sucursal.nombre, importe)
                poliza.addToPartidas(det)
            }
        }
        */
        def impuestoNeto = (cxp.impuestoTrasladado ?: 0.00) - (cxp.impuestoRetenidoIva ?: 0.00)
        CuentaContable ivaPendiente = buscarCuenta('119-0002-0000-0000')

        poliza.addToPartidas(build(cxp, ivaPendiente, desc, suc, impuestoNeto ))

         if(cxp.impuestoRetenidoIva > 0.0) {      
            
            CuentaContable ivaRet2 = buscarCuenta('119-0003-0000-0000')
            CuentaContable ivaRet3 = buscarCuenta('216-0001-0000-0000')
    
            poliza.addToPartidas(build(cxp,ivaRet2, desc, suc, cxp.impuestoRetenidoIva))
            poliza.addToPartidas(build(cxp,ivaRet3, desc, suc,0.00, cxp.impuestoRetenidoIva))
       
        }

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
        cuenta = buscarCuenta(cv)
        BigDecimal total = cxp.total
        poliza.addToPartidas(build(cxp,cuenta,desc, sucursal.nombre, 0.0, total ))
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
            asiento =  "PROVISION_DE_SEGURO"
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
        
           String cv = "205-0006-${co.cuentaOperativa}-0000"
        if(co.tipo == 'SEGUROS') {
            cv = "205-0003-${co.cuentaOperativa}-0000"
        }
       
        return cv
    }

    CuentaOperativaProveedor buscarCuentaOperativa(Proveedor p) {
        CuentaOperativaProveedor co = CuentaOperativaProveedor.where{proveedor == p}.find()

        return co
    }

    private validarCuentaContable(ConceptoDeGasto con) {
        if(con.cuentaContable == null) {
            /*
            throw new RuntimeException("""
            No existe cuenta contable asignada a la partida  (concepto de gasto) por: ${con.importe}
            XML: ${con.cfdiDet.comprobante.uuid}
            """)
            */
            con.cuentaContable = buscarCuenta('600-0000-0000-0000')
        }
    }


}
