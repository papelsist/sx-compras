package sx.contabilidad.fiscal

import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import org.apache.commons.lang3.exception.ExceptionUtils
import java.sql.SQLException
import groovy.util.logging.Slf4j

import sx.core.LogUser
import sx.contabilidad.SqlAccess

import sx.utils.Periodo

@Slf4j
class AuditoriaFiscalCfdiService implements LogUser, SqlAccess {

    def auditar(Integer ej, Integer ms) {

        def rows = getAllRows(getSatInfoQuery(), [ej, ms])

        def periodo = Periodo.getPeriodoEnUnMes(ms + 1, ej)

        def sxRows = getAllRows(getSiipapQuery(), [periodo.fechaInicial, periodo.fechaFinal])
        
        // log.info('Sx: {}', sxRows)

        rows.each { row ->
            log.info('Evaluando: {}', row)
            def registrosSx = 0
            def found = sxRows.find{it.tipo == row.tipo && it.estatus == row.estatus}
            if(found) {
                registrosSx = found.registrosSx
            }
            def audit = AuditoriaFiscalCfdi.findOrCreateWhere(ejercicio: ej, mes: ms, tipo: row.tipo, estatus: row.estatus)
            audit.registrosSat = row.registrosSat
            audit.registrosSx = registrosSx
            audit.save failOnError: true, flush: true
        }

        // def entities = rows.collect{ new AuditoriaFiscalCfdi(it)}
        // log.info('Entities: {}', entities)
        
    }


    String getSatInfoQuery() {
        return """
            select 
                ejercicio, 
                mes, 
                efecto_comprobante as tipo,
                case when estatus = 1 then 'VIGENTE' else 'CANCELADO' end as estatus,
                count(0) as registrosSat
                from sat_metadata 
            where ejercicio = ? and mes = ?
            group by 
                ejercicio, 
                mes, 
                efecto_comprobante,
                estatus
            
        """
    }

    String getSiipapQuery() {
        return """
        select 
            tipo_de_comprobante as tipo,
            case when cancelado = 0 then 'VIGENTE' else 'CANCELADO' end as estatus,  
            count(0) as registrosSx
            from cfdi 
        where fecha between ? and ?
        group by 
            tipo_de_comprobante,
            cancelado
        """
    }

    String getRecibidosQuery() {
        return """

        """
    }

    String getRhQuery() {
        return """

        """
    }

    def getRhRows(String sql) {
        def db = getRhSql()
        try {
            return db.rows(sql)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }


    def getRhSql() {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        String dbUrl = 'jdbc:mysql://10.10.1.229/sx_rh'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }

    
}
