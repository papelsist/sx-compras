package sx.contabilidad


import grails.rest.*
import grails.converters.*
import groovy.sql.Sql
import org.apache.commons.lang3.exception.ExceptionUtils
import java.sql.SQLException
import groovy.util.logging.Slf4j
import grails.plugin.springsecurity.annotation.Secured
import sx.utils.Periodo
import static org.springframework.http.HttpStatus.OK


@Slf4j
@Secured("ROLE_CONTABILIDAD")
class AuxiliaresController {
	static responseFormats = ['json']
	AuxiliaresService auxiliaresService
    
    def bancos(){
        Periodo periodo = params.periodo
        String select = auxiliaresService.getSelect('BANCOS').replaceAll('@FECHA_INICIAL', auxiliaresService.toSqlDate(periodo.fechaInicial)).replaceAll('@FECHA_FINAL', auxiliaresService.toSqlDate(periodo.fechaFinal)).
        replaceAll('@CUENTA', params.cuenta)
        def rows = auxiliaresService.getAllRows(select,[])
        respond rows
    }
    
    def general(){
        // Periodo periodo = params.periodo
        String select = auxiliaresService.getSelect('GENERAL') // .replaceAll('@FECHA_INICIAL', auxiliaresService.toSqlDate(periodo.fechaInicial)).replaceAll('@FECHA_FINAL', auxiliaresService.toSqlDate(periodo.fechaFinal)).
        // replaceAll('@CUENTA', params.cuenta)
        def rows = auxiliaresService.getAllRows(select,[])
        respond rows
    }



}
