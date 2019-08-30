package sx.cxp

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j


import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic


import sx.core.LogUser
import sx.core.Sucursal
import sx.utils.Periodo
import sx.utils.MonedaUtils
import sx.sat.ProductoSatClase


@Transactional
@Slf4j
@GrailsCompileStatic
class GastoDetService implements LogUser{

    GastoDet save(GastoDet gasto) {
        if(!gasto.cuentaContable) {
            String claveSat = gasto.claveProdServ
            if (claveSat) {
                String sclave = claveSat.substring(0, 6) 
                log.info('Localizando cuenta contable para producto sat con clase: {}', sclave)
                ProductoSatClase pp = ProductoSatClase.where{clave == sclave}.find()
                if(pp && pp.cuentaContable) 
                    gasto.cuentaContable = pp.cuentaContable

            }
        }
        logEntity(gasto)
        gasto = gasto.save failOnError: true, flush: true
        log.info('Saved gasto: {}', gasto)
        return gasto
    }
    
    List<GastoDet> prorratear(GastoDet gasto, Map<String, Map<String, Boolean>> data) {
        CuentaPorPagar factura = gasto.cxp
        log.info('Prorrateando {} en {}', gasto.importe, data)
        data.each {
            if(it.value) {
                Map<String, Boolean> map = it.value
                Sucursal sucursal = Sucursal.where{clave == map.key}.find()
                GastoDet det = new GastoDet()
                det.properties = gasto.properties
                det.sucursal = sucursal
                det.sucursalNombre = sucursal.nombre
                det.save failOnError: true, flush: true
            }
        }
        gasto.delete flush: true
        
        return GastoDet.where{cxp == factura}.list()
    }
    
}


