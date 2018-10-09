package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Publisher
import grails.gorm.services.Service
import sx.core.LogUser
import sx.core.Proveedor
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

    ListaDePreciosProveedor actualizarProductos(ListaDePreciosProveedor lista) {

        List<ProveedorProducto> prods = ProveedorProducto.where{proveedor == lista.proveedor && suspendido == false && moneda == lista.moneda}.list()
        log.info('Productos activos del proveedor: {} ', prods.collect{it.producto.clave}.join(',').size())
        List<String> existentes = lista.partidas.collect {it.clave.trim()}
        log.info('En lista {}', existentes.size())

        List<ProveedorProducto> faltantes = prods.findAll{ item ->
            def good = existentes.contains(item.producto.clave.trim())
            return !good
        }
        log.debug('Faltantes: {}', faltantes.size())
        faltantes.each {
            ListaDePreciosProveedorDet det = new ListaDePreciosProveedorDet()
            det.producto = it
            det.clave = it.producto.clave
            det.descripcion = it.producto.descripcion
            det.unidad = it.producto.unidad
            det.precioAnterior = it.precio
            det.precioBruto = it.precio
            det.desc1 = it.desc1
            det.desc3 = it.desc2
            det.desc3 = it.desc3
            det.desc4 = it.desc4
            det.precioNeto = it.precio
            lista.addToPartidas(det)
        }
        return save(lista)
    }



    abstract void delete(Serializable id)
}
