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

    public build(Integer ejercicio, Integer mes) {
        // buildBancos(ejercicio, mes)
        // buildInversiones(ejercicio, mes)
        // buildOtrasCuentasPorCobrar(ejercicio, mes)
       buildPagosAnticipados(ejercicio, mes)
    }

    public buildBancos(Integer ej, Integer ms) {
        
        def rows = [
            // BANCOS
            new AjustePorInflacion(
                '102-0001-0003-0000', 'BBVA BANCOMER CTA 1166228100', 'SISTEMA FINANCIERO', 'BANCOS'),
            
            new AjustePorInflacion('102-0001-0001-0000', 'BANAMEX CTA 1858193', 'SISTEMA FINANCIERO', 'BANCOS'),
            new AjustePorInflacion('102-0001-0006-0000', 'HSBC CTA 4019118074', 'SISTEMA FINANCIERO', 'BANCOS'),
            new AjustePorInflacion('102-0001-0002-0000', 'SCOTIABANK CTA 00001691945', 'SISTEMA FINANCIERO', 'BANCOS'),
            new AjustePorInflacion('102-0001-0004-0000', 'SANTANDER SERFIN CTA 65-50219406-7', 'SISTEMA FINANCIERO', 'BANCOS'),
            new AjustePorInflacion('102-0001-0005-0000', 'IXE BANCO SA 1666987-8', 'SISTEMA FINANCIERO', 'BANCOS'),
            new AjustePorInflacion('', 'UBS AG CTO 406546', 'SISTEMA FINANCIERO', 'BANCOS'),
            new AjustePorInflacion('102-0001-0007-0000', 'INTERACCIONES CASA DE BOLSA', 'SISTEMA FINANCIERO', 'BANCOS')
            
        ]
        calcularPosSaldoFinal('SISTEMA FINANCIERO', 'BANCOS', ej, ms, rows)

    }

    def buildInversiones(Integer ej, Integer ms) {
        def rows = [
            new AjustePorInflacion('103-0001-0003-0000', 'BBVA BANCOMER CTA: 1338355940', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            new AjustePorInflacion('103-0001-0010-0000', 'BBVA BANCOMER', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            new AjustePorInflacion('103-0001-0001-0000', 'BANAMEX CTA: 74724833', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            new AjustePorInflacion('103-0001-0002-0000', 'SCOTIABANK CTA: 18705486', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            new AjustePorInflacion('', 'IXE BANCO SA INVERSION CTA: 5019623', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            new AjustePorInflacion('103-0001-0009-0000', 'CASA DE BOLSA BANORTE S.A. DE C.V.', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            // 
        ]
        calcularPosSaldoFinal('SISTEMA FINANCIERO', 'INVERSIONES', ej, ms, rows)
    }


    def buildOtrasCuentasPorCobrar(Integer ej, Integer ms) {
        def tipo = 'SISTEMA FINANCIERO'
        def grupo = 'OTRAS CUENTAS POR COBRAR'
        def rows = [
            new AjustePorInflacion('105-0001-0000-0000', 'CLIENTES CON',tipo, grupo),
            new AjustePorInflacion('105-0002-0000-0000', 'CLIENTES COD',tipo, grupo),
            new AjustePorInflacion('105-0003-0000-0000', 'CLIENTES CRE',tipo, grupo),
            new AjustePorInflacion('105-0004-0000-0000', 'PARTES RELACIONADAS',tipo, grupo),
            new AjustePorInflacion('', 'CLIENTES EN MONEDA EXTRANJERA',tipo, grupo),
            new AjustePorInflacion('107-0000-0000-0000', 'DEUDORES DIVERSOS',tipo, grupo),
            new AjustePorInflacion('106-0001-0000-0000', 'DOCUMENTOS POR COBRAR',tipo, grupo),
            new AjustePorInflacion('106-0002-0000-0000', 'CUENTAS EN TRAMITE JURIDICO',tipo, grupo)
        ]
        calcularPosSaldoFinal(tipo, grupo, ej, ms, rows)
    }

    def buildPagosAnticipados(Integer ej, Integer ms) {
        def tipo = 'SISTEMA FINANCIERO'
        def grupo = 'PAGOS ANTICIPADOS'
        def mm = Mes.findByClave(ms - 1)
        def prop = mm.nombre.toLowerCase()
        def rows = []

        // ISR A FAVOR DEL EJERCICIO
        def isrDelEjercicio = new AjustePorInflacion('113-0002-0000-0000', 'ISR A FAVOR DEL EJERCICIO',tipo, grupo);
        def anterior = getPeriodoAnterior(ej, ms)
        def s1 = SaldoPorCuentaContable.where{clave == isrDelEjercicio.cuenta && ejercicio == anterior.ejercicio && mes == anterior.mes}.find()
        def s2 = SaldoPorCuentaContable.where{clave == isrDelEjercicio.cuenta && ejercicio == ej && mes == ms}.find()
        if(s1 && s2) {
            isrDelEjercicio[prop] = s1.saldoFinal - s2.haber
        }
        rows << isrDelEjercicio

        // IVA DEL MES
        def ivaDelMes = new AjustePorInflacion('113-0001-0000-0000', 'IVA A FAVOR ',tipo, grupo)
        def sIvaDelMes = SaldoPorCuentaContable.where{clave == isrDelEjercicio.cuenta && ejercicio == ej && mes == ms}.find()
        if (sIvaDelMes) {
            ivaDelMes[prop] = sIvaDelMes.saldoInicial - sIvaDelMes.haber
        }
        rows << ivaDelMes

        // ISR A FAVOR DEL MES
        rows << generarIsrDelMes(tipo, grupo, ej, ms)
        rows << generarDepositosEnGarantia(tipo, grupo, ej, ms)
        rows.each {log.info('{} {}: {}', it.concepto , mm.nombre, it[prop])}

        def suma = new AjustePorInflacion('', grupo, tipo, grupo)
        suma[prop] = rows.sum(0.0, {it[prop]})
        log.info('{} : {}', suma.concepto , suma[prop])   
        rows << suma
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



    def calcularPosSaldoFinal(String tipo, String grupo, Integer ej, Integer ms, def rows) {
        def mm = Mes.findByClave(ms - 1)
        def prop = mm.nombre.toLowerCase()
        log.info('****** {} {}', grupo.toUpperCase(), prop.toUpperCase())

        rows.each { item ->
            def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && cuenta.clave == item.cuenta}.find()
            if(saldo) {
                item[prop] = saldo.saldoFinal
            }
            log.info('{} {}: {}', item.concepto , mm.nombre, item[prop])   
        }
        def suma = new AjustePorInflacion('', grupo, tipo, grupo)
        suma[prop] = rows.sum(0.0, {it[prop]})
        log.info('{} : {}', suma.concepto , suma[prop])   
        rows << suma
    }

    def generarIsrDelMes(String tipo, String grupo, Integer ej, Integer ms) {
        def anterior = getPeriodoAnterior(ej, ms)
        def clave = '113-0004-0000-0000'
        def row = new AjustePorInflacion(clave, 'ISR A FAVOR DEL MES',tipo, grupo);
        def s1 = SaldoPorCuentaContable.where{clave == row.cuenta && ejercicio == anterior.ejercicio && mes == anterior.mes}.find()
        def s2 = SaldoPorCuentaContable.where{clave == row.cuenta && ejercicio == ej && mes == ms}.find()
        if(s1 && s2) {
            row[prop] = s1.saldoFinal - s2.haber
        }
        return row
    }

    def generarDepositosEnGarantia(String tipo, String grupo, Integer ej, Integer ms) {
        def mm = Mes.findByClave(ms - 1)
        def prop = mm.nombre.toLowerCase()
        def row = new AjustePorInflacion('184-0000-0000-0000', 'DEPOSITOS EN GARANTIA',tipo, grupo)
        def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && clave == row.cuenta}.find()
        if(saldo) {
            row[prop] = saldo.saldoFinal
        }
        return row

    }

    /**********  Pasivos ************/

    def buildCuentasPorPagar(Integer ejercicio, Integer mes) {
        def tipo = 'PASIVOS'
        def grupo = 'CUENTAS POR PAGAR'
        def rows = []
        rows << new AjustePorInflacion('', 'PROVEEDORES EXTRANJEROS', tipo, grupo)
        rows << new AjustePorInflacion('201-0002-0000', 'PROVEEDORES NACIONALES', tipo, grupo)
        rows << new AjustePorInflacion('201-0001-0000', 'PROVEEDORES PARTES RELACIONADAS', tipo, grupo)
        rows << new AjustePorInflacion('205-0001-0000', 'AVREDORES DIVERSOS', tipo, grupo)
        
        calcularPosSaldoFinal(tipo, grupo, ej, ms, rows)

    }

    def buildImpuestosPorPagar() {
        def tipo = 'PASIVOS'
        def grupo = 'IMPUESTOS POR PAGAR'
        def rows = []
        rows << new AjustePorInflacion('213-0003-0000-0000', 'IVA PAGO PROVISIONAL', tipo, grupo)
        rows << new AjustePorInflacion('213-0004-0000-0000', 'IMPUESTO ESTATAL SOBRE NOMINAS', tipo, grupo)
        rows << new AjustePorInflacion('213-0005-0000-0000', 'INFONAVIT', tipo, grupo)
        rows << new AjustePorInflacion('213-0006-0000-0000', 'IMSS', tipo, grupo)
        rows << new AjustePorInflacion('213-0007-0000-0000', 'SAR CESANTIA Y VEJEZ', tipo, grupo)
        calcularPosSaldoFinal(tipo, grupo, ej, ms, rows)
    }

    def buildDocumentosPorPagar() {
        def tipo = 'PASIVOS'
        def grupo = 'DOCUMENTOS POR PAGAR'
        def rows = []
        rows << new AjustePorInflacion('210-0000-0000-0000', 'PROVISIONES DE PAGO', tipo, grupo)
        rows << generarPtu(tipo, grupo, ej, ms)
        rows << new AjustePorInflacion('', 'ACREDORES DIVERSOS A LARGO PLAZO', tipo, grupo)
        rows << new AjustePorInflacion('', 'APORTACIONES P/FUTURO AUMENTO CAPITAL', tipo, grupo)
     
        calcularPosSaldoFinal(tipo, grupo, ej, ms, rows)
    }

    def generarPtu(String tipo, String grupo, Integer ej, Integer ms) {
        def anterior = getPeriodoAnterior(ej, ms)
        def clave = '215-0000-0000-0000'
        def row = new AjustePorInflacion(clave, 'PTU',tipo, grupo);
        if(mes > 2) {
            def saldo = SaldoPorCuentaContable.where{clave == row.cuenta && ejercicio == ej && mes == ms}.find()
            if(saldo) {
                row[prop] = saldo.saldoFinal
            }
        }
        return row
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
