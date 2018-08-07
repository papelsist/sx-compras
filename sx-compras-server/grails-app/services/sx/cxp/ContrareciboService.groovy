package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import sx.core.LogUser


@GrailsCompileStatic
@Service(Contrarecibo)
abstract class ContrareciboService implements LogUser {

    abstract Contrarecibo save( Contrarecibo recivo)

    Contrarecibo saveRecibo(Contrarecibo  recibo) {
        logEntity(recibo)
        return save(recibo)
    }


}
