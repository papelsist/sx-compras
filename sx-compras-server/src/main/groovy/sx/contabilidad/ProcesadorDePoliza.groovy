package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Empresa

import java.sql.SQLException
import java.text.DecimalFormat
import java.text.NumberFormat

@Slf4j
// @GrailsCompileStatic
trait ProcesadorDePoliza {

    @Autowired
    @Qualifier('dataSource')
    def dataSource

    DecimalFormat tipoDeCambioFormat

    Empresa empresa

    String definirConcepto(Poliza poliza){
        return "${poliza.tipo} ${poliza.subtipo} ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    Poliza recalcular(Poliza poliza) {
        log.info('Recalculando poliza {}', poliza)
        return poliza
    }

    Poliza generarComplementos(Poliza poliza) {
        return poliza
    }

    CuentaContable buscarCuenta(String clave) {
        CuentaContable cuenta = CuentaContable.where{clave == clave}.find()
        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable ${clave}")
        return cuenta
    }

    List getAllRows(String sql,List params){
        Sql db = getSql()
        try {
            return db.rows(sql,params)
        }catch (SQLException e){
            Throwable c = ExceptionUtils.getRootCause(e)
            String message = ExceptionUtils.getRootCauseMessage(e)
            log.error(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    Map  getRow(String sql, List params){
        Sql db = getSql()
        try {
            return db.firstRow(sql, params)
        }catch (SQLException e){
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            log.error(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    String toSqlDate(Date date){
        return date.format('yyyy-MM-dd')
    }

    Sql getSql(){
        return new Sql(dataSource)
    }

    String formatTipoDeCambio(def tc){
        return getTcFormat().format(tc)
    }

    DecimalFormat getTcFormat() {
        if(!this.tipoDeCambioFormat) {
            tipoDeCambioFormat = new DecimalFormat()
            tipoDeCambioFormat.setMaximumFractionDigits(4)
            tipoDeCambioFormat.setMinimumFractionDigits(0)
            tipoDeCambioFormat.setGroupingUsed(false)
        }
        return this.tipoDeCambioFormat
    }

    Empresa getEmpresa() {
        if(!this.empresa) {
            empresa = Empresa.first()
        }
        return empresa
    }

}