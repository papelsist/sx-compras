package sx.core

import groovy.transform.CompileDynamic

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.http.HttpStatus

import java.sql.SQLException

@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class ProveedorProductoController extends RestfulController<ProveedorProducto> {
    
    static responseFormats = ['json']

    ProveedorProductoService proveedorProductoService

    ProveedorProductoController() {
        super(ProveedorProducto)
    }

    @Override
    protected ProveedorProducto saveResource(ProveedorProducto resource) {
        return this.proveedorProductoService.save(resource)
    }

    @Override
    protected ProveedorProducto updateResource(ProveedorProducto resource) {
        return this.proveedorProductoService.save(resource)
    }


    @Transactional
    Object delete(ProveedorProducto instance) {

        if(handleReadOnly()) {
            return
        }
        // ProveedorProducto instance = ProveedorProducto.get(params.id)

        if (instance == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }
        respond proveedorProductoService.deleteProducto(instance)
    }


    @CompileDynamic
    @Override
    protected List<ProveedorProducto> listAllResources(Map params) {
        // 
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = 3000
        String proveedorId = params.proveedorId
        String mda = params.moneda;
        def query = ProveedorProducto.where{proveedor.id == proveedorId}
        if(mda) {
            query = query.where{moneda == mda}
        }
        List res = query.list(params)
        log.info('Productos del proveedor: {} moneda: {} Productos: {}', proveedorId, mda, res.size())
        return res
    }

    def disponibles() {
        log.info('Disponibles: {}', params)
        def rows = Producto.findAll("from Producto p " +
                " where p.activo = true " +
                " and p.id not in(" +
                "       select pp.producto.id from ProveedorProducto pp " +
                "       where pp.proveedor.id = ? and pp.moneda = ?) " +
                " order by p.linea.linea",
                [params.proveedorId, params.moneda])
        respond rows, [view: '']
    }


    def agregarProductos(AgregarProductosCommand command) {
        String proveedorId = params.proveedorId
        Proveedor proveedor = Proveedor.get(proveedorId)
        List<ProveedorProducto> res = []
        command.productos.each { Producto it ->
            ProveedorProducto pp = new ProveedorProducto(
                    proveedor: proveedor,
                    producto: it,
                    claveProveedor:it.clave,
                    moneda: command.moneda,
                    descripcionProveedor: it.descripcion,
            )
            res << proveedorProductoService.save(pp)
        }

        respond res
        // render 'A SQLException Was Handled'
    }

    def handleException(Exception e) {
        String msg = ExceptionUtils.getRootCauseMessage(e)
        log.debug('Error: {}', msg)
        render (status: HttpStatus.INTERNAL_SERVER_ERROR.value(), text: msg)
    }
}

class AgregarProductosCommand {
    String moneda
    List<Producto> productos

    String toString() {
        return "${moneda} Prods: ${productos.join(',')}"
    }


}
