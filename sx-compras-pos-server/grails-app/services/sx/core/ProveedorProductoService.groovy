package sx.core

import grails.compiler.GrailsCompileStatic

import grails.gorm.services.Service
import grails.gorm.services.Where



@GrailsCompileStatic
@Service(ProveedorProducto)
abstract class ProveedorProductoService implements LogUser {



    @Where({ proveedor.id == proveedorId && moneda == moneda })
    abstract List<ProveedorProducto> findProductos(String proveedorId, String moneda)


}
