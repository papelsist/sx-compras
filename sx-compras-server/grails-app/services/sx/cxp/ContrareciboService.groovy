package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import sx.core.LogUser


@GrailsCompileStatic
@Service(Contrarecibo)
abstract class ContrareciboService implements LogUser {

    abstract Contrarecibo save( Contrarecibo recivo)

    abstract void delete(Serializable id)

    Contrarecibo saveRecibo(Contrarecibo  recibo) {
        logEntity(recibo)
        return save(recibo)
    }

    Contrarecibo update(Contrarecibo recibo) {
        recibo.partidas.each {
            it.contrarecibo = recibo.id
        }
        return save(recibo)
    }




}
