package sx.core

import grails.gorm.services.Service


@Service(ProveedorProducto)
interface ProveedorProductoService {

    ProveedorProducto save(ProveedorProducto producto)

}
