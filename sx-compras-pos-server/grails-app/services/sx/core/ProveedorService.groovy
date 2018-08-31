package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service



@GrailsCompileStatic
@Service(Proveedor)
abstract class ProveedorService implements LogUser {

    abstract Long count()

    abstract Proveedor findByClave(String clave)

    abstract Proveedor findByRfc(String rfc)


}

