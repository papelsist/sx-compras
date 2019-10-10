package sx.contabilidad.fiscal

import java.sql.SQLException

import groovy.transform.Canonical
import groovy.transform.ToString


import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils


import org.springframework.stereotype.Component

import sx.core.LogUser
import sx.contabilidad.SqlAccess
import sx.contabilidad.CuentaContable
import sx.contabilidad.SaldoPorCuentaContable
import sx.utils.Mes

@Slf4j
@Component
class AjusteAnualPorInflacionBuilder implements  SqlAccess, LogUser{

    // @Autowired
    // @Qualifier('dataSource')
    // def dataSource

    public buildFrom(Integer ejercicio , Integer mes) {
       def rows = buildAjustes(ejercicio)
       log.info('Ajustes generados: {}', rows.size())
        (1..mes).each {
            build(ejercicio, it, rows)
        }
    }

    public build(Integer ejercicio, Integer mes, def rows) {
        
        // Activos
        buildBancos(ejercicio, mes, rows)
        buildInversiones(ejercicio, mes, rows)
        buildOtrasCuentasPorCobrar(ejercicio, mes, rows)
        buildPagosAnticipados(ejercicio, mes, rows)
        
        // Pasivos
        buildCuentasPorPagar(ejercicio, mes, rows)
        buildImpuestosPorPagar(ejercicio, mes, rows)
        buildDocumentosPorPagar(ejercicio, mes, rows)
        

    }

    def buildAjustes(Integer ej) {
        AjusteAnualPorInflacion.executeUpdate("delete from AjusteAnualPorInflacion where ejercicio = ?", [ej])
        def conceptos = AjustePorInflacionConcepto.where{activo == true}.list([sort: 'orden']) 
        def rows = []
        conceptos.each { c ->
            log.info('Generando: {} ', c.concepto)
            def aju = new AjusteAnualPorInflacion(ejercicio: ej, concepto: c)
            logEntity(aju)
            rows << aju.save(flush: true)
        }
        return rows
    }

    def buildBancos(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'BANCOS'
        def bancos = rows.findAll{it.tipo == tpo && it.grupo == gpo} 
        calcularPosSaldoFinal(tpo, gpo, ej, ms, bancos)
        sumarizar(bancos, ms)
    }
    

    def buildInversiones(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'INVERSIONES'
        def bancos = rows.findAll{it.tipo == tpo && it.grupo == gpo} 
        calcularPosSaldoFinal(tpo, gpo, ej, ms, bancos)
        sumarizar(bancos, ms)
    }


    def buildOtrasCuentasPorCobrar(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'OTRAS CUENTAS POR COBRAR'
        def bancos = rows.findAll{it.tipo == tpo && it.grupo == gpo} 
        calcularPosSaldoFinal(tpo, gpo, ej, ms, bancos)
        sumarizar(bancos, ms)
    }

    def buildPagosAnticipados(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        generarIsrDelEjercicio(ej, ms, rows)
        generarIvaDelMes(ej, ms, rows)
        generarIsrDelMes(ej, ms, rows)
        generarDepositosEnGarantia(ej, ms, rows)
    }

    private generarIsrDelEjercicio(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def aju = rows.find{it.concepto.clave == '113-0002-0000-0000' && it.tipo == tpo && it.grupo == gpo}
        def cc = aju.concepto
        
        def anterior = getPeriodoAnterior(ej, ms)
        def s1 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == anterior.ejercicio && mes == anterior.mes}.find()
        def s2 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == ej && mes == ms}.find()
        if(s1 && s2) {
            aju[prop] = s1.saldoFinal - s2.haber
        }
    }

    private generarIvaDelMes(Integer ej ,Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def aju = rows.find{it.concepto.clave == '113-0001-0000-0000' && it.tipo == tpo && it.grupo == gpo}
        def cc = aju.concepto

        def saldo = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == ej && mes == ms}.find()
        if (saldo) {
            aju[prop] = saldo.saldoInicial - saldo.haber
        }
    }

    private generarIsrDelMes(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def aju = rows.find{it.concepto.clave == '113-0004-0000-0000' && it.tipo == tpo && it.grupo == gpo}
        def cc = aju.concepto
        
        def anterior = getPeriodoAnterior(ej, ms)
        def s1 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == anterior.ejercicio && mes == anterior.mes}.find()
        def s2 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == ej && mes == ms}.find()
        if(s1 && s2) {
            aju[prop] = s1.saldoFinal - s2.haber
        }
    }

    def generarDepositosEnGarantia(Integer ej, Integer ms, def rows) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def aju = rows.find{it.concepto.clave == '184-0000-0000-0000' && it.tipo == tpo && it.grupo == gpo}
        def cc = aju.concepto
        def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && cuenta == cc.cuenta}.find()
        if(saldo) {
            aju[prop] = saldo.saldoFinal
        }
    }

    

    /**********  Pasivos ************/

    def buildCuentasPorPagar(Integer ej, Integer ms, def rows) {
        def tpo = 'PASIVO'
        def gpo = 'CUENTAS POR PAGAR'
        def cxcs = rows.findAll{it.tipo == tpo && it.grupo == gpo}
        // log.info('Ctas por pagar: {}', cxcs.size()) 
        calcularPosSaldoFinal(tpo, gpo, ej, ms, cxcs)
        sumarizar(cxcs, ms)
    }

    def buildImpuestosPorPagar(Integer ej, Integer ms, def rows) {
        def tpo = 'PASIVO'
        def gpo = 'IMPUESTOS POR PAGAR'
        def impuestos = rows.findAll{it.tipo == tpo && it.grupo == gpo}
        calcularPosSaldoFinal(tpo, gpo, ej, ms, impuestos)
        sumarizar(impuestos, ms)
    }

    def buildDocumentosPorPagar(Integer ej, Integer ms, def rows) {
        
        def tpo = 'PASIVO'
        def gpo = 'DOCUMENTOS POR PAGAR'
        def documentos = rows.findAll{it.tipo == tpo && it.grupo == gpo && it.concepto.clave != '215-0000-0000-0000'}
        calcularPosSaldoFinal(tpo, gpo, ej, ms, documentos)
        generarPtu(ej, ms, rows)
        sumarizar(documentos, ms)
        /*
        def conceptos = AjustePorInflacionConcepto.where{
            tipo == tpo && grupo == gpo && activo == true }.list()
        def rows = []
        conceptos.each { c ->
            log.info('Procesando: {}', c.concepto)
            def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: c)
            if(aju.concepto?.cuenta?.clave == '215-0000-0000-0000') {
                generarPtu(ej, ms, aju)
            } 
            aju.save failOnError: true, flush: true
            rows << aju
        }
        
        calcularPosSaldoFinal(tpo, gpo, ej, ms, rows)
        */
    }

    private generarPtu(Integer ej, Integer ms, def rows) {
        def aju = rows.find{it.concepto.clave == '215-0000-0000-0000'}
        def prop = resolverMesPropery(ms)
        if(ms > 2) {
            def saldo = SaldoPorCuentaContable.where{cuenta == aju.concepto.cuenta && ejercicio == ej && mes == ms}.find()
            if(saldo) {
                aju[prop] = saldo.saldoFinal.abs()
            }
        }
        aju.save flush: true
        return aju
    }


    /*** Utils methods **/

    def calcularPosSaldoFinal(String tpo, String gpo, Integer ej, Integer ms, def rows) {
        
        def prop = resolverMesPropery(ms)
        log.info('****** {} {}', gpo.toUpperCase(), prop.toUpperCase())
        rows.each { item ->
            def cc = item.concepto
            if(cc.cuenta) {
                def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && cuenta == cc.cuenta}.find()
                if(saldo) {
                    item[prop] = saldo.saldoFinal.abs()
                    logEntity(item)
                }
            }
            // item.save flush: true
            // log.info('{} {}: {}', item.concepto.concepto , ms, item[prop])   
        }
        return rows   
    }

    def sumarizar(def rows, Integer ms) {
        def prop = resolverMesPropery(ms)
        def suma = rows.find{it.concepto.concepto == 'SUMA'}
        suma[prop] = rows.sum(0.0, {it[prop]})
        log.info('Sumarizando: {} : {}', suma.concepto.concepto , suma[prop])
        return suma
    }

    

    def getPeriodoAnterior(Integer ej, Integer ms) {
        def ejercicio = ej
        def mes = ms
        if (mes == 12) {
            ejercicio = ejercicio - 1
            mes = 1
        } else {
            mes = mes - 1
        }
        return [ejercicio:ejercicio, mes: mes]
    }

    def resolverMesPropery(Integer ms) {
        def mm = Mes.findByClave(ms - 1)
        def prop = mm.nombre.toLowerCase()
    }

    
    
}


@Canonical( includes = ['cuenta', 'concepto', 'tipo', 'grupo'])
@ToString()
class AjustePorInflacion {
    String cuenta
    String concepto
    String tipo
    String grupo

    BigDecimal enero = 0.0
    BigDecimal febrero = 0.0
    BigDecimal marzo = 0.0
    BigDecimal abril = 0.0
    BigDecimal mayo = 0.0
    BigDecimal junio = 0.0
    BigDecimal julio = 0.0
    BigDecimal agosto = 0.0
    BigDecimal septiembre = 0.0
    BigDecimal octubre = 0.0
    BigDecimal noviembre = 0.0
    BigDecimal diciembre = 0.0

}
/*
class AjustePorInflacionHistorico {

    Integer ejercicio

    Map<String, BigDecimal> activos 
    Map<String, BigDecimal> pasivos  

    BigDecimal promedioDeActivos
    BigDecimal promedioDePasivos

    BigDecimal inpc
    BigDecimal inpcAnterior

    BigDecimal factor

    BigDecimal ajusteDeducible
    BigDecimal ajusteAc

}
*/
