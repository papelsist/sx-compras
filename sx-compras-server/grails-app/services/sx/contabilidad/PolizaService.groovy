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
        /*
        PolizaFolio folio = findFolio(poliza)
        poliza.folio = folio.folio

        folio.folio = folio.folio + 1
        */

        asignarFolio(poliza)
        logEntity(poliza)
        // poliza = poliza.save flush: true
        // folio.save flush: true
        poliza =  save(poliza)
        // folio.save flush: true
        return poliza

    }

    @CompileDynamic
    Poliza updatePoliza(Poliza poliza) {
        logEntity(poliza)
        poliza.debe = poliza.partidas.sum 0.0, {it.debe}
        poliza.haber = poliza.partidas.sum 0.0, {it.haber}
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
        String name = poliza.subtipo.toLowerCase()
                .replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )
        return "${name}Proc"

    }



}
