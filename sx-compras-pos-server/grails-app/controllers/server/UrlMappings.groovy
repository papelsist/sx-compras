package server

class UrlMappings {

    static mappings = {

        "/api/sucursales"(resources: 'sucursal', includes:['index', 'show'])
        "/api/productos"(resources: 'producto', includes:['index', 'show'])
        "/api/proveedores"(resources: 'proveedor', includes:['index', 'show']){
            "/productos"(resources: 'proveedorProducto', includes:['index', 'show'])
            "/productos/disponibles"(controller: 'proveedorProducto', action: 'disponibles')
        }

        // Ordenes de compra
        "/api/compras"(resources: 'compra',  excludes:['create', 'edit','patch']){
            "/partidas"(resources: 'compraDet', excludes:['create', 'edit','patch'])
        }
        "/api/compras/cerrar/$id"(controller: 'compra', action: 'cerrar', method: 'PUT')
        "/api/compras/depurar/$id"(controller: 'compra', action: 'depurar', method: 'PUT')
        "/api/compras/print/$id"(controller: 'compra', action: 'print', method: 'GET')



        "/api/coms"(resources: 'recepcionDeCompra',  excludes:['create', 'edit','patch']){
            "/partidas"(resources: 'recepcionDeCompraDet', excludes:['create', 'edit','patch'])
        }

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
