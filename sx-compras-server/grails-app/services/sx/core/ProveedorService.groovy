package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service



@GrailsCompileStatic
@Service(Proveedor)
abstract class ProveedorService implements LogUser {

    Proveedor save(Proveedor proveedor) {
        logEntity(proveedor)
        proveedor.save failOnError:true, flush:true
        return proveedor
    }

    abstract Long count()

    abstract void delete(Serializable id)

    abstract Proveedor findByClave(String clave)

    abstract Proveedor findByRfc(String rfc)


}

