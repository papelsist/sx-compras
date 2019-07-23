package server

class UrlMappings {

    static mappings = {

        "/api/config"(resource: 'appConfig', includes:['index', 'show'])

        "/api/sucursales"(resources: 'sucursal', includes:['index', 'show'])
        "/api/productos"(resources: 'producto', includes:['index', 'show'])
        "/api/proveedores"(resources: 'proveedor', includes:['index', 'show']){
            "/productos"(resources: 'proveedorProducto', includes:['index', 'show'])
            "/productos/disponibles"(controller: 'proveedorProducto', action: 'disponibles')
        }

        // requisicionDeMaterial de material
        "/api/requisicionDeMaterial"(resources: 'requisicionDeMaterial',  excludes:['create', 'edit','patch'])
        "/api/requisicionDeMaterial/disponibles"(controller: 'requisicionDeMaterial', action: 'disponibles')

        // Ordenes de compra
        "/api/compras"(resources: 'compra',  excludes:['create', 'edit','patch']){
            "/partidas"(resources: 'compraDet', excludes:['create', 'edit','patch'])
        }
        "/api/compras/cerrar/$id"(controller: 'compra', action: 'cerrar', method: 'PUT')
        "/api/compras/depurar/$id"(controller: 'compra', action: 'depurar', method: 'PUT')
        "/api/compras/print/$id"(controller: 'compra', action: 'print', method: 'GET')
        "/api/compras/pendientes/${proveedorId}"(controller: 'compra', action: 'pendientes', method: 'GET')



        "/api/coms"(resources: 'recepcionDeCompra',  excludes:['create', 'edit','patch']){
            "/partidas"(resources: 'recepcionDeCompraDet', excludes:['create', 'edit','patch'])
        }
        "/api/coms/print/$id"(controller: 'recepcionDeCompra', action: 'print', method: 'GET')
        "/api/coms/recepcionesPorDia"(controller: 'recepcionDeCompra', action: 'recepcionesPorDia', method: 'GET')

        /// Alcances
        "/api/alcances/list"(controller: 'alcances', action: 'list')
        "/api/alcances/generar"(controller: 'alcances', action: 'generar', method: 'POST')
        "/api/alcances/generarOrden"(controller: 'alcances', action: 'generarOrden', method: 'POST')
        "/api/alcances/actualizarMeses"(controller: 'alcances', action: 'actualizarMeses', method: 'PUT')
        "/api/alcances/print"(controller: 'alcances', action: 'print', method: 'GET')

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
