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
        if(! poliza.id) {
            asignarFolio(poliza)
        }
        logEntity(poliza)
        return save(poliza)
    }

    Poliza updatePoliza(Poliza poliza) {
        logEntity(poliza)
        return save(poliza)
    }

    void asignarFolio(Poliza poliza){
        PolizaFolio folio = PolizaFolio.findOrSaveWhere(
                ejercicio: poliza.ejercicio,
                mes: poliza.mes,
                tipo: poliza.tipo,
                subtipo: poliza.subtipo
        )
        poliza.folio = folio.folio++
        folio.save()
    }

    @CompileDynamic
    @NotTransactional
    String resolverProcesador(Poliza poliza) {
        String name = poliza.subtipo.toLowerCase()
                .replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )
        return "${name}Proc"

    }



}
