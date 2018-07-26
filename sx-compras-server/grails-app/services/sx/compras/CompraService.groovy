package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import sx.core.LogUser


@GrailsCompileStatic
@Service(ListaDePreciosProveedor)
abstract class CompraService implements LogUser{

    abstract Compra save(Compra compra)

    abstract void delete(Serializable id)

    Compra saveCompra(Compra compra) {
        logEntity(compra)
        return save(compra)

    }
}
