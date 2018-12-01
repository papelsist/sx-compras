package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(Poliza)
abstract class PolizaService implements  LogUser{

    abstract  Poliza save(Poliza poliza)

    abstract void delete(Serializable id)

    Poliza salvarPolza(Poliza poliza) {
        if(! poliza.id)
            asignarFolio(poliza)
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

}
