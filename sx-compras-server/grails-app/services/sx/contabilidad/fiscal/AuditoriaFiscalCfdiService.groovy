package sx.contabilidad.fiscal

import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import org.apache.commons.lang3.exception.ExceptionUtils
import java.sql.SQLException
import groovy.util.logging.Slf4j

import sx.core.LogUser
import sx.contabilidad.SqlAccess

@Slf4j
class AuditoriaFiscalCfdiService implements LogUser, SqlAccess {

    def auditar(Integer ej, Integer ms) {
        def rows = getAllRows(getSatInfoQuery(), [ej, ms])

        

        def sxRows = getAllRows(getSiipapQuery(), [])
        
        
        rows.each { row ->
            
            def found = sxRows.find{it.tipo == row.tipo && it.estatus == row.estatus}
            if(found) {
                row.registrosSx = found.registrosSx
            }
            log.info('R: {}', row)
            def audit = AuditoriaFiscalCfdi.findOrCreateWhere(ejercicio: ej, mes: ms, tipo: row.tipo, estatus: row.estatus)
            audit.registrosSat = row.registrosSat
            audit.registrosSx = row.registrosSx ?: 0
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
        where fecha between '2018-01-01 00:00:00' and '2018-01-31 23:00:00' 
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

    
}
