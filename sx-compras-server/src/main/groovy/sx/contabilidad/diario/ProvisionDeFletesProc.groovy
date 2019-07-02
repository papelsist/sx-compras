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
class ProvisionDeFletesProc implements  ProcesadorDePoliza, AsientoBuilder {

    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE FLETES ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    def generarAsientos(Poliza poliza, Map params) {
        List<RembolsoDet> rembolsos = RembolsoDet
                .findAll("from RembolsoDet d where date(d.rembolso.egreso.fecha) = ? ",
                [poliza.fecha])
        rembolsos.each { r ->
            if(r.cxp ){
                CuentaPorPagar cxp = r.cxp
                CuentaOperativaProveedor co = CuentaOperativaProveedor.findByProveedor(cxp.proveedor)
                if(co){
                    if(co.tipo == 'FLETES'){
                        String suc = r.rembolso.sucursal.nombre
                        cargoGasto(poliza, cxp, suc)
                        log.info('REMBOLSO {} : {}', r.rembolso.concepto, r.rembolso.id)
                        abonoProveedorGastoRembolso(poliza, cxp, r)
                    }
                }
            } else {
                // log.info('Abono a {}, Cta:{} Imp: {}',r.nombre,  r.comentario, r.apagar)
                abonoProveedorDescuentos(poliza, r)
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
        def gasto = cfdi.conceptos.first()
        def con = gasto.conceptos.first()
        validarCuentaContable(con)
        PolizaDet det = build(cxp, con.cuentaContable, desc, con.sucursal.nombre,cfdi.subTotal)
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

    }

    def abonoProveedorGastoRembolso(Poliza poliza, CuentaPorPagar cxp,  RembolsoDet rembolsoDet) {

        Sucursal sucursal = rembolsoDet.rembolso.sucursal

        String desc = """
            F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
        """
        CuentaContable cuenta
        String cv = resolverClaveDeCuenta(cxp)
       
        cuenta = buscarCuenta(cv)
   

        BigDecimal total = rembolsoDet.apagar // cxp.total
        poliza.addToPartidas(build(cxp,cuenta,desc, sucursal.nombre, 0.0, total ))
    }

    def abonoProveedorDescuentos(Poliza poliza, RembolsoDet rembolsoDet) {

        Sucursal sucursal = rembolsoDet.rembolso.sucursal

        String desc = """
            ${rembolsoDet.nombre} F: ${rembolsoDet.documentoFolio?: ''}
        """
        CuentaContable cta = CuentaContable.where{clave == rembolsoDet.comentario}.find()
        if(cta) {
            BigDecimal total = rembolsoDet.apagar
            PolizaDet det = new PolizaDet()
            det.with {
                cuenta = cta
                concepto = cta.descripcion
                descripcion = desc
                asiento =  "PROVISION_DE_FLETE"
                referencia = rembolsoDet.rembolso.nombre
                referencia2 = rembolsoDet.rembolso.nombre
                origen =  rembolsoDet.id
                documento =  rembolsoDet.rembolso.id
                documentoTipo =  rembolsoDet.nombre
                documentoFecha =  rembolsoDet.rembolso.fecha
                debe = 0.0
                haber = total
            }

            det.entidad = 'RembolsoDet'
            //det.sucursal = 'OFICINAS'
            det.sucursal = sucursal.nombre
            poliza.addToPartidas(det)
        }
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
            asiento =  "PROVISION_DE_FLETE"
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
        if(co.tipo == 'FLETES') {
            cv = "205-0004-${co.cuentaOperativa}-0000"
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


}
