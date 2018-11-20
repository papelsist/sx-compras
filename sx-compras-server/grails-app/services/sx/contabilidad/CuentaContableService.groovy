package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Service(CuentaContable)
abstract class CuentaContableService {

    abstract  CuentaContable save(CuentaContable cuenta)

    abstract void delete(Serializable id)

}
