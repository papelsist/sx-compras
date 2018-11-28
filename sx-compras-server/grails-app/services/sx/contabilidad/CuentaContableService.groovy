package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(CuentaContable)
abstract class CuentaContableService implements  LogUser{

    abstract  CuentaContable save(CuentaContable cuenta)

    abstract void delete(Serializable id)

    CuentaContable salvarCuenta(CuentaContable cuenta) {
        logEntity(cuenta)
        return save(cuenta)
    }

}
