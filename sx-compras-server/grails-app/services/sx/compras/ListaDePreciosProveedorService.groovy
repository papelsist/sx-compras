package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import sx.core.LogUser


@GrailsCompileStatic
@Service(ListaDePreciosProveedor)
abstract class ListaDePreciosProveedorService implements LogUser{

    ListaDePreciosProveedor save(ListaDePreciosProveedor lp) {
        logEntity(lp)
        lp.save failOnError:true, flush:true
        return lp
    }
}
