package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Publisher
import grails.gorm.services.Service
import sx.core.LogUser
import sx.core.ProveedorProducto


@GrailsCompileStatic
@Service(ListaDePreciosProveedor)
abstract class ListaDePreciosProveedorService implements LogUser{

    ListaDePreciosProveedor save(ListaDePreciosProveedor lp) {
        logEntity(lp)
        lp.save failOnError:true, flush:true
        return lp
    }

    @Publisher()
    ListaDePreciosProveedor aplicarListaDePrecios(ListaDePreciosProveedor lista) {
        lista.partidas.each { ListaDePreciosProveedorDet det ->
            ProveedorProducto prod = det.producto
            prod.precioBruto = det.precioBruto
            prod.desc1 = det.desc1
            prod.desc2 = det.desc2
            prod.desc3 = det.desc3
            prod.desc4 = det.desc4
            prod.precio = det.precioNeto
            prod.lista = lista.id
            prod.save flush: true
        }
        lista.aplicada = new Date()
        return this.save(lista)

    }

    abstract void delete(Serializable id)
}
