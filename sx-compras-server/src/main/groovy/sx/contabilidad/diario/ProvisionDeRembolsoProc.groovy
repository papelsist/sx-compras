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
class ProvisionDeRembolsoProc implements  ProcesadorDePoliza, AsientoBuilder {

    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE REMBOLSO ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    def generarAsientos(Poliza poliza, Map params) {

        List<RembolsoDet> rembolsos = RembolsoDet
                .findAll("from RembolsoDet d where date(d.rembolso.egreso.fecha) = ?  and d.rembolso.concepto = 'REMBOLSO' order by d.rembolso.egreso.referencia",
                [poliza.fecha])

        rembolsos.each { r ->
            CuentaPorPagar cxp = r.cxp
            if (cxp){
                CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
                String suc = r.rembolso.sucursal.nombre
                cargoGasto(poliza, cxp, suc, r)
                // log.info('REMBOLSO {} : {}', r.rembolso.concepto, r.rembolso.id)
                abonoProveedor(poliza, cxp, r)
            }else{
                cargoProveedorNoDeducible(poliza, r)
                abonoGastoNoDeducible(poliza, r)
            }
        }

        poliza.validate()
        poliza = poliza.save failOnError: true, flush: true
        return poliza
    }


    def cargoGasto(Poliza poliza, CuentaPorPagar cxp, String suc, RembolsoDet r) {

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
            ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}
        """

        def cfdi = cxp.comprobanteFiscal

        /*
        def gasto = cfdi.conceptos.first()
        def con = gasto.conceptos.first()
        validarCuentaContable(con)
        def impt = cfdi.subTotal - (cfdi.descuento?: 0.0)
        PolizaDet det = build(cxp, con.cuentaContable, desc, con.sucursal.nombre, impt)
        poliza.addToPartidas(det)
        */

        def gasto = cfdi.conceptos.first()
        def cta = CuentaContable.where{clave: '600-0004-0000-0000'}.find()
        def sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        if(gasto.conceptos) {
            def con = gasto.conceptos.first()
            validarCuentaContable(con)
            cta = con.cuentaContable
            sucursal = con.sucursal
        }
        PolizaDet det = build(cxp, cta, desc, sucursal.nombre, cfdi.subTotal)
        poliza.addToPartidas(det)

        def impuestoNeto = (cxp.impuestoTrasladado ?: 0.00) - (cxp.impuestoRetenidoIva ?: 0.00)

        CuentaContable ivaPendiente = buscarCuenta('118-0002-0000-0000')
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

    def abonoProveedor(Poliza poliza, CuentaPorPagar cxp,  RembolsoDet rembolsoDet) {
        Sucursal sucursal = rembolsoDet.rembolso.sucursal

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio?:''} (${cxp.fecha.format('dd/MM/yyyy')}) CH: ${rembolsoDet.rembolso.egreso.referencia}
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

    def abonoGastoNoDeducible(Poliza poliza, RembolsoDet det) {
        Sucursal suc = det.rembolso.sucursal
        String desc = """
            F:${det.documentoSerie?:''} ${det.documentoFolio?:''} (${det.documentoFecha?.format('dd/MM/yyyy')})
            CH: ${det.rembolso?.egreso?.referencia}
        """
        CuentaContable  cta = buscarCuenta("101-0002-${suc.clave.padLeft(4, '0')}-0000")
        // log.info("cta: {} sucursal: {} ",cta,suc )
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

    def cargoProveedorNoDeducible(Poliza poliza,  RembolsoDet det) {
        Sucursal suc = det.rembolso.sucursal
        String desc = """
            F:${det.documentoSerie?:''} ${det.documentoFolio?:''} (${det.documentoFecha?.format('dd/MM/yyyy')})
        """
        def cv = "600-0031-${suc.clave.padLeft(4, '0')}-0000"

        log.info('Prov Imorte: {} {} {} ID: {}', det.apagar.abs(), det.concepto, det.comentario, det.rembolso.id)
        CuentaContable cta = buscarCuenta(cv)
        if(det.comentario && det.comentario.startsWith('107')) {
            cta = buscarCuenta(det.comentario)
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
            debe = det.apagar.abs()
            haber = 0.00
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
