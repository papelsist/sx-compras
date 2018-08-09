package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j



@Slf4j
@GrailsCompileStatic
@Service(AplicacionDePago)
abstract class AplicacionDePagoService {

    abstract AplicacionDePago save(AplicacionDePago aplicacionDePago)

    abstract void delete(Serializable id)


}
