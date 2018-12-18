package sx.cfdi

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.Folio
import sx.core.LogUser


@Slf4j
@GrailsCompileStatic
@Service(CancelacionDeCfdi)
abstract class CfdiCanceladoService implements  LogUser {

    public static FOLIO_KEY = 'CFDI_CANCELADOS'

    abstract  CancelacionDeCfdi save(CancelacionDeCfdi cancelado)

    abstract void delete(Serializable id)

    @CompileDynamic
    CancelacionDeCfdi salvarCancelacion(CancelacionDeCfdi cancelacion) {
        logEntity(cancelacion)
        // Asignando folio
        Folio folio = Folio.findOrCreateWhere(entidad: this.FOLIO_KEY, cancelacion.cfdi.origen.toUpperCase())
        Long res = folio.folio + 1
        folio.folio = res
        folio.save()

        cancelacion.folio = res
        return save(cancelacion)
    }

    CancelacionDeCfdi updateCancelacion(CancelacionDeCfdi cancelacion) {
        logEntity(cancelacion)
        return save(cancelacion)
    }

}

