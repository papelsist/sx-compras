package sx.contabilidad.fiscal

import java.sql.SQLException

import groovy.transform.Canonical
import groovy.transform.ToString


import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils


import org.springframework.stereotype.Component

import sx.contabilidad.SqlAccess
import sx.contabilidad.CuentaContable
import sx.contabilidad.SaldoPorCuentaContable
import sx.utils.Mes

@Slf4j
@Component
class AjusteAnualPorInflacionBuilder implements  SqlAccess{

    // @Autowired
    // @Qualifier('dataSource')
    // def dataSource

    public buildFrom(Integer ejercicio , Integer mes) {
        (1..mes).each {
            build(ejercicio, it)
        }
    }

    public build(Integer ejercicio, Integer mes) {
        // Activos
        
        buildBancos(ejercicio, mes)
        buildInversiones(ejercicio, mes)
        buildOtrasCuentasPorCobrar(ejercicio, mes)
        buildPagosAnticipados(ejercicio, mes)
        // Pasivos
        buildCuentasPorPagar(ejercicio, mes)
        buildImpuestosPorPagar(ejercicio, mes)
        buildDocumentosPorPagar(ejercicio, mes)

    }

    public buildBancos(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'BANCOS'
        def conceptos = AjustePorInflacionConcepto.where{tipo == tpo && grupo == gpo && activo == true}.list()
        def rows = []
        conceptos.each { c ->
            log.info('Procesando: {}', c.concepto)
            def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: c)
            aju.save failOnError: true, flush: true
            rows << aju
        }
        calcularPosSaldoFinal(tpo, gpo, ej, ms, rows)
    }
    

    def buildInversiones(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'INVERSIONES'
        def conceptos = AjustePorInflacionConcepto.where{tipo == tpo && grupo == gpo && activo == true}.list()
        def rows = []
        conceptos.each { c ->
            log.info('Procesando: {}', c.concepto)
            def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: c)
            aju.save failOnError: true, flush: true
            rows << aju
        }
        calcularPosSaldoFinal(tpo, gpo, ej, ms, rows)
    }


    def buildOtrasCuentasPorCobrar(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'OTRAS CUENTAS POR COBRAR'
        def conceptos = AjustePorInflacionConcepto.where{tipo == tpo && grupo == gpo && activo == true}.list()
        def rows = []
        conceptos.each { c ->
            log.info('Procesando: {}', c.concepto)
            def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: c)
            aju.save failOnError: true, flush: true
            rows << aju
        }
        calcularPosSaldoFinal(tpo, gpo, ej, ms, rows)
    }

    def buildPagosAnticipados(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def rows = []
        rows << generarIsrDelEjercicio(ej, ms)
        rows << generarIvaDelMes(ej, ms)
        rows << generarIsrDelMes(ej, ms)
        rows << generarDepositosEnGarantia(ej, ms)
        def prop = resolverMesPropery(ms)
        def cpto = AjustePorInflacionConcepto.findOrSaveWhere(concepto: 'SUMA', tipo: tpo, grupo: gpo)
        def suma = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: cpto)
        suma[prop] = rows.sum(0.0, {it[prop]})
        suma = suma.save failOnError: true, flush: true
        
    }

    private generarIsrDelEjercicio(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)

        def cc = AjustePorInflacionConcepto.where{cuenta.clave == '113-0002-0000-0000' && tipo == tpo}.find()
        def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: cc)
        
        def anterior = getPeriodoAnterior(ej, ms)
        def s1 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == anterior.ejercicio && mes == anterior.mes}.find()
        def s2 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == ej && mes == ms}.find()
        if(s1 && s2) {
            aju[prop] = s1.saldoFinal - s2.haber
        }
        aju.save failOnError: true, flush: true
    }

    private generarIvaDelMes(Integer ej ,Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def cc = AjustePorInflacionConcepto.where{cuenta.clave == '113-0001-0000-0000' && tipo == tpo}.find()
        def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: cc)
        def saldo = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == ej && mes == ms}.find()
        if (saldo) {
            aju[prop] = saldo.saldoInicial - saldo.haber
        }
        aju.save failOnError: true, flush: true
    }

    private generarIsrDelMes(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def cc = AjustePorInflacionConcepto.where{cuenta.clave == '113-0004-0000-0000' && tipo == tpo}.find()
        
        def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: cc)
        
        def anterior = getPeriodoAnterior(ej, ms)
        def s1 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == anterior.ejercicio && mes == anterior.mes}.find()
        def s2 = SaldoPorCuentaContable.where{cuenta == cc.cuenta && ejercicio == ej && mes == ms}.find()
        if(s1 && s2) {
            aju[prop] = s1.saldoFinal - s2.haber
        }
        aju.save failOnError: true, flush: true
    }

    def generarDepositosEnGarantia(Integer ej, Integer ms) {
        def tpo = 'ACTIVO'
        def gpo = 'PAGOS ANTICIPADOS'
        def prop = resolverMesPropery(ms)
        def cc = AjustePorInflacionConcepto.where{cuenta.clave == '184-0000-0000-0000' && tipo == tpo}.find()
        def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: cc)
        def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && cuenta == cc.cuenta}.find()
        if(saldo) {
            aju[prop] = saldo.saldoFinal
        }
        aju.save failOnError: true, flush: true
    }

    

    /**********  Pasivos ************/

    def buildCuentasPorPagar(Integer ej, Integer ms) {
        def tpo = 'PASIVO'
        def gpo = 'CUENTAS POR PAGAR'
        def conceptos = AjustePorInflacionConcepto.where{tipo == tpo && grupo == gpo && activo == true}.list()
        def rows = []
        conceptos.each { c ->
            log.info('Procesando: {}', c.concepto)
            def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: c)
            aju.save failOnError: true, flush: true
            rows << aju
        }
        calcularPosSaldoFinal(tpo, gpo, ej, ms, rows)
    }

    def buildImpuestosPorPagar(Integer ej, Integer ms) {
        def tpo = 'PASIVO'
        def gpo = 'IMPUESTOS POR PAGAR'
        def conceptos = AjustePorInflacionConcepto.where{tipo == tpo && grupo == gpo && activo == true}.list()
        def rows = []
        conceptos.each { c ->
            log.info('Procesando: {}', c.concepto)
            def aju = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: c)
            aju.save failOnError: true, flush: true
            rows << aju
        }
        calcularPosSaldoFinal(tpo, gpo, ej, ms, rows)
    }

    def buildDocumentosPorPagar(Integer ej, Integer ms) {
        
        def tpo = 'PASIVO'
        def gpo = 'DOCUMENTOS POR PAGAR'
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
    }

    private generarPtu(Integer ej, Integer ms, def aju) {
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
                    item[prop] = saldo.saldoFinal
                }
            }
            item.save flush: true
            log.info('{} {}: {}', item.concepto.concepto , ms, item[prop])   
        }
        
        def cpto = AjustePorInflacionConcepto.findOrSaveWhere(concepto: 'SUMA', tipo: tpo, grupo: gpo)
        def suma = AjusteAnualPorInflacion.findOrCreateWhere(ejercicio: ej, concepto: cpto)
        suma[prop] = rows.sum(0.0, {it[prop]})
        suma = suma.save failOnError: true, flush: true
        log.info('{} : {}', suma.concepto , suma[prop])
        return rows   
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

/*
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
