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

        List<PolizaDetDTO> res = PolizaDet.findAll(
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
                    where d.cuenta.id = ? 
                    and d.poliza.fecha between ? and ? 
                    and d.poliza.cierre != null
                    order by d.id 
            """,[command.cuenta.id,
                 command.periodo.fechaInicial,
                 command.periodo.fechaFinal])

        // Obtener el inicio de mes del fecha inicial
        /*
        Date inicioDeMes = Periodo.inicioDeMes(command.periodo.fechaInicial)
        Integer ej = Periodo.obtenerYear(inicioDeMes)
        Integer m = Periodo.obtenerMes(inicioDeMes) + 1

        SaldoPorCuentaContable saldo = SaldoPorCuentaContable.where{
            cuenta == command.cuentaInicial && ejercicio == ej && mes == m
        }.find()
        if(saldo) {
            // Calcular los cargos y abonos en el periodo anteriro
            def row = PolizaDet
                    .findAll("""
                select sum(d.debe), sum(d.haber)
                    from PolizaDet d
                     where d.cuenta = ?
                     and d.poliza.ejercicio = ?
                     and d.poliza.mes = ?
                     """
                    ,[command.cuentaInicial, ej, m])
            BigDecimal debe = row.get(0)[0]?:0.0
            BigDecimal haber = row.get(0)[1]?:0.0
            saldoInicial = saldo.saldoInicial + debe - haber
            log.info('Saldo Inicial: {}', saldoInicial)
        }
        log.info('Acumulado: {}', saldoInicial)
        BigDecimal acu = saldoInicial
        res.each {
            it.inicial = acu
            it.acumulado = it.inicial + it.debe - it.haber
            acu += it.acumulado
            log.info('Acu: {}', acu)
        }

        */
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
    CuentaContable cuenta
}

@Canonical(excludes = "inicial, acumulado")
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
    BigDecimal inicial
    BigDecimal acumulado

}