package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Subscriber
import groovy.util.logging.Slf4j
import sx.core.ProveedorProducto

@Slf4j
@GrailsCompileStatic
class ListaDePreciosProveedorListener {



    /**
     * Actualiza los precios del proveedor segun la lista de precios
     *
     * @param lista
     */
    @Subscriber()
    void onAplicarListaDePrecios(ListaDePreciosProveedor lista) {
        println 'Transfiriendo precios de la lista de precios....'
        log.debug('Transfiriendo precios de la lista: {}', lista.id)
        if(!lista.aplicada) {
            lista.partidas.each { ListaDePreciosProveedorDet det ->
                ProveedorProducto prod = det.producto
                prod.precioBruto = det.precioBruto
                prod.desc1 = det.desc1
                prod.desc2 = det.desc2
                prod.desc3 = det.desc3
                prod.desc4 = det.desc4
                prod.precio = det.precioNeto
                prod.save flush: true
            }
            lista.aplicada = new Date()
            lista.save flush: true
        }
    }
}
