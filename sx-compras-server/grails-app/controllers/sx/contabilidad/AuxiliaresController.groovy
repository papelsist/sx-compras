package sx.contabilidad


import grails.rest.*
import grails.converters.*
import grails.validation.Validateable
import groovy.sql.Sql
import groovy.transform.Canonical
import groovy.transform.ToString
import org.apache.commons.lang3.exception.ExceptionUtils
import java.sql.SQLException
import groovy.util.logging.Slf4j
import grails.plugin.springsecurity.annotation.Secured
import sx.utils.Periodo

import static org.springframework.http.HttpStatus.NOT_FOUND
import static org.springframework.http.HttpStatus.OK


@Slf4j
@Secured("ROLE_CONTABILIDAD")
class AuxiliaresController {
	static responseFormats = ['json']
	AuxiliaresService auxiliaresService
    
    def bancos(){

        Periodo periodo = params.periodo
        log.info('Ejecutando: {}', this.params)
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

    def auxiliar(AuxiliarCommand command) {
        if(command == null) {
            render status: NOT_FOUND
            return
        }
        log.info('Auxiliar: {}', command)
        List res = PolizaDet.findAll(
                """
            select new sx.contabilidad.PolizaDetDTO(
                d.id,
                d.poliza.tipo,
                d.poliza.subtipo,
                d.poliza.folio,
                d.poliza.ejercicio,
                d.poliza.mes,
                d.poliza.fecha,
                d.cuenta.clave,
                d.concepto,
                d.descripcion,
                d.sucursal,
                d.asiento,
                d.debe,
                d.haber
                )  
                from PolizaDet d 
                    where d.cuenta.clave between ? and ? 
                    and d.poliza.fecha between ? and ?
            """,[command.cuentaInicial.clave,
                 command.cuentaFinal.clave,
                 command.periodo.fechaFinal,
                 command.periodo.fechaFinal])
        respond res
    }

    protected void notFound() {
        request.withFormat {
            '*'{ render status: NOT_FOUND }
        }
    }



}

@ToString
class AuxiliarCommand implements  Validateable{
    Periodo periodo
    CuentaContable cuentaInicial
    CuentaContable cuentaFinal
}

@Canonical
class PolizaDetDTO {
    Long id
    String tipo
    String subtipo
    Integer poliza
    Integer ejercicio
    Integer mes
    Date fecha
    String clave
    String concepto
    String descripcion
    String sucursal
    String asiento
    BigDecimal debe
    BigDecimal haber

}