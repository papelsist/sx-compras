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

        AuditoriaFiscalCfdi.executeUpdate("delete from AuditoriaFiscalCfdi where ejercicio = ? and mes = ?", [ej, ms])
        
        def rows = getAllRows(getSatInfoQuery(), [ej, ms])

        def periodo = Periodo.getPeriodoEnUnMes(ms - 1, ej)

        def sxRows = getAllRows(getSiipapQuery(), [periodo.fechaInicial, periodo.fechaFinal])
        
        def res = []
        
        rows.each { row ->
            log.info('Evaluando: {}', row)
            def registrosSx = 0
            def found = sxRows.find{it.tipo == row.tipo && it.estatus == row.estatus}
            if(found) {
                registrosSx = found.registrosSx
            }
            if(row.tipo == 'N' && row.estatus == 'VIGENTE') {
                def nom = fromRh(getRhVigentesQuery(), [periodo.fechaInicial, periodo.fechaFinal])
                if(nom) {
                    registrosSx = nom.registrosSx
                }
                log.info('Nomina: {}', nom)
            }
            def audit = AuditoriaFiscalCfdi.findOrCreateWhere(ejercicio: ej, mes: ms, tipo: row.tipo, estatus: row.estatus)
            audit.registrosSat = row.registrosSat
            audit.registrosSx = registrosSx
            audit.save failOnError: true, flush: true
            audit.refresh()
            res << audit
        }

        return res
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
            and emisor_rfc = 'PAP830101CR3'
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
        where date(fecha) between ? and ?
        group by 
            tipo_de_comprobante,
            cancelado
        """
    }

    String getRecibidosQuery() {
        return """
        """
    }

    String getRhVigentesQuery() {
        return """
            select count(0) as registrosSx
            from cfdi 
            where date(fecha) between ? and ?
            and cancelado is null
        """
    }

    

    Map  fromRh(String sql, List params){
        log.info('RH select {}', params)
        Sql db = getRhSql()
        try {
            return db.firstRow(sql, params)
        }catch (SQLException e){
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            log.error('Error: {}',message, e)
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
