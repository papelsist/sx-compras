package sx.contabilidad

import grails.compiler.GrailsCompileStatic

import grails.gorm.services.Service
import grails.gorm.transactions.NotTransactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.LogUser
 
@Slf4j
@GrailsCompileStatic
@Service(Poliza)
abstract class PolizaService implements  LogUser{

    abstract  Poliza save(Poliza poliza)

    abstract void delete(Serializable id)

    Poliza salvarPolza(Poliza poliza) {
        asignarFolio(poliza)
        logEntity(poliza)
        poliza =  save(poliza)
        return poliza
    }

    @CompileDynamic
    Poliza updatePoliza(Poliza poliza) {
        logEntity(poliza)
        poliza.debe = poliza.partidas.sum 0.0, {it.debe}
        poliza.haber = poliza.partidas.sum 0.0, {it.haber}
        poliza.partidas.each {
            it.concepto = concatenar(it.cuenta)
        }
        return save(poliza)
    }

    void asignarFolio(Poliza poliza){
        PolizaFolio folio = PolizaFolio.where {
            ejercicio == poliza.ejercicio && mes == poliza.mes && tipo == poliza.tipo && subtipo == poliza.subtipo
        }.find()
        if(!folio){
            folio = new PolizaFolio(
                    ejercicio: poliza.ejercicio,
                    mes: poliza.mes,
                    tipo: poliza.tipo,
                    subtipo: poliza.subtipo)
            folio.folio = 0
        }
        Integer next = folio.folio + 1
        poliza.folio = next
        folio.folio = next
        folio.save flush: true
    }

    PolizaFolio findFolio(Poliza poliza){
        PolizaFolio folio = PolizaFolio.findOrSaveWhere(
                ejercicio: poliza.ejercicio,
                mes: poliza.mes,
                tipo: poliza.tipo,
                subtipo: poliza.subtipo
        )
        return folio
    }

    @CompileDynamic
    @NotTransactional
    String resolverProcesador(Poliza poliza) {
        /*
        String name = poliza.subtipo.toLowerCase()
                .replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )
        return "${name}Proc"
        */
        return resolverProcesador(poliza.subtipo)

    }

    @CompileDynamic
    @NotTransactional
    String resolverProcesador(String subtipo) {
        String name = subtipo.toLowerCase()
                .replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )
        return "${name}Proc"

    }

    @NotTransactional
    def concatenar(CuentaContable cta) {
        String cto = cta.descripcion
        def p1 = cta.padre
        if(p1) {
            cto = p1.descripcion + " " + cto
            def p2 = p1.padre
            if(p2) {
                cto = p2.descripcion + " " + cto
                def p3 = p2.padre
                if(p3) {
                    cto = p3.descripcion + " " + cto
                }
            }
        }
        return cto
    }

    @NotTransactional
    List<Poliza> refoliar(String subtipo, Integer ejercicio, Integer mes) {
        List<Poliza> polizas = Poliza.where{
            subtipo == subtipo && ejercicio == ejercicio && mes == mes
        }.list([sort: 'fecha', order: 'asc'])

        int folio = 0
        polizas.each { p ->
            folio ++
            p.folio = folio
            p.save(flush: true)
        }
        PolizaFolio pfolio = PolizaFolio.where{
            subtipo == subtipo && ejercicio == ejercicio && mes == mes
        }.find()
        pfolio.folio = folio
        pfolio.save flush: true
        return polizas
    }



}
