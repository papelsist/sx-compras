package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import sx.core.Folio
import sx.core.LogUser


@GrailsCompileStatic
@Service(Contrarecibo)
abstract class ContrareciboService implements LogUser {

    abstract Contrarecibo save( Contrarecibo recivo)

    abstract void delete(Serializable id)

    Contrarecibo saveRecibo(Contrarecibo  recibo) {
        if(!recibo.id) {
            recibo.folio = nextFolio()
        }
        logEntity(recibo)
        return save(recibo)
    }

    Long  nextFolio(){
        Folio folio = Folio.findOrCreateWhere(entidad: 'CXP', serie: 'CONTRARECIBOS')
        Long res = folio.folio + 1
        folio.folio = res
        folio.save flush: true
        return res
    }


}
