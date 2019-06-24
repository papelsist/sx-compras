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
class ProvisionDeGastosProc implements  ProcesadorDePoliza, AsientoBuilder {

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
            cargoGasto(poliza, cxp, 'OFICINAS')
            log.info('REQUISICION: {}', req.requisicion.folio)
            abonoProveedorGasto(poliza, cxp, 'OFICINAS')
        }

        List<RembolsoDet> rembolsos = RembolsoDet
                .findAll("from RembolsoDet d where date(d.cxp.fecha) = ?",
                [poliza.fecha])
        rembolsos.each { r ->
            CuentaPorPagar cxp = r.cxp
            String suc = r.rembolso.sucursal.nombre
            cargoGasto(poliza, cxp, suc)
            log.info('REMBOLSO {} : {}', r.rembolso.concepto, r.rembolso.id)
            abonoProveedorGastoRembolso(poliza, cxp, r)
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

        cfdi.conceptos.each { gasto ->
            gasto.conceptos.each { con ->
                PolizaDet det = build(cxp, con.cuentaContable, desc, con.sucursal.nombre, con.importe)
                poliza.addToPartidas(det)
            }
        }

        CuentaContable ivaPendiente = buscarCuenta('119-0002-0000-0000')
        poliza.addToPartidas(build(cxp, ivaPendiente, desc, suc, cfdi.impuestoTrasladado))

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
            log.info('Armando cuenta: ')
            if(rembolsoDet.rembolso.concepto == 'REMBOLSO') {
                cv = "205-0005-${sucursal.clave.padLeft(4, '0')}-0000"
                cuenta = buscarCuenta(cv)
            } else{
                cuenta = buscarCuenta('205-0005-0999-0000')
            }
        }

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


}
