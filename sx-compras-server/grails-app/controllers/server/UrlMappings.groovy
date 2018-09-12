package server

class UrlMappings {

    static mappings = {

        "/api/sucursales"(resources: 'sucursal')

        "/api/lineas"(resources: 'linea')
        "/api/marcas"(resources: 'marca')
        "/api/productos"(resources: 'producto')
        "/api/proveedores"(resources: 'proveedor'){
            "/productos"(resources: 'proveedorProducto', excludes:['create', 'save', 'edit','patch'])
            "/productos/disponibles"(controller: 'proveedorProducto', action: 'disponibles')
            "/productos/agregarProductos"(controller: 'proveedorProducto', action: 'agregarProductos', method: 'PUT')
            "/saldo"(resources: 'proveedorSaldo', excludes:['create', 'edit','patch'])
        }

        "/api/listaDePreciosProveedor"(resources: 'listaDePreciosProveedor')
        "/api/listaDePreciosProveedor/aplicar/$id"(controller: 'listaDePreciosProveedor', action: 'aplicar', method: 'PUT')
        "/api/listaDePreciosProveedor/actualizar/$id"(controller: 'listaDePreciosProveedor', action: 'actualizar', method: 'PUT')
        "/api/listaDePreciosProveedor/actualizarCompras/$id"(controller: 'listaDePreciosProveedor', action: 'actualizarCompras', method: 'PUT')
        "/api/listaDePreciosProveedor/print/$id"(controller: 'listaDePreciosProveedor', action: 'print', method: 'GET')

        // Ordenes de compra
        "/api/compras"(resources: 'compra'){
            "/partidas"(resources: 'compraDet', excludes:['create', 'edit','patch'])
        }
        "/api/compras/cerrar/$id"(controller: 'compra', action: 'cerrar', method: 'PUT')
        "/api/compras/depurar/$id"(controller: 'compra', action: 'depurar', method: 'PUT')
        "/api/compras/print/$id"(controller: 'compra', action: 'print', method: 'GET')


        "/api/comprobanteFiscal"(resources: 'comprobanteFiscal')
        "/api/comprobanteFiscal/xml/$id"(controller: 'comprobanteFiscal', action: 'xml')
        "/api/comprobanteFiscal/pdf/$id"(controller: 'comprobanteFiscal', action: 'pdf')


        "/api/cuentaPorPagar"(resources: 'cuentaPorPagar')
        "/api/cuentaPorPagar/pendientesDeAnalisis/$proveedorId"(controller: 'cuentaPorPagar', action: 'pendientesDeAnalisis')
        "/api/cuentaPorPagar/pendientes/$proveedorId"(controller: 'cuentaPorPagar', action: 'pendientes')

        "/api/analisisDeFactura"(resources: 'analisisDeFactura', excludes:['create', 'edit','patch']) {
            "/partidas"(resources: 'analisisDeFacturaDet', excludes:['create', 'edit','patch'])
        }
        "/api/analisisDeFactura/cerrar/$id"(controller: 'analisisDeFactura', action: 'cerrar', method: 'PUT')
        "/api/analisisDeFactura/print/$id"(controller: 'analisisDeFactura', action: 'print', method: 'GET')
        "/api/analisisDeFactura/entradasAnalizadas"(controller: 'analisisDeFactura', action: 'entradasAnalizadas', method: 'GET')
        "/api/analisisDeFactura/comsSinAnalizar"(controller: 'analisisDeFactura', action: 'comsSinAnalizar', method: 'GET')



        "/api/requisicionesDeCompras"(resources: 'requisicionDeCompras')
        "/api/requisicionesDeCompras/cerrar/$id"(controller:'requisicionDeCompras', action: 'cerrar', method: 'PUT')
        "/api/requisicionesDeCompras/print/$id"(controller: 'requisicionDeCompras', action: 'print', method: 'GET')
        "/api/requisicionesDeCompras/pendientes/$proveedorId"(controller: 'requisicionDeCompras', action: 'pendientes', method: 'GET')


        "/api/cxp/contrarecibos"(resources: 'contrarecibo')
        "/api/cxp/contrarecibos/print/$id"(controller: 'contrarecibo', action: 'print', method: 'GET')
        "/api/cxp/contrarecibos/pendientes/$proveedorId"(controller: 'contrarecibo', action: 'pendientes', method: 'GET')

        "/api/cxp/notas"(resources: 'notaDeCreditoCxP', excludes:['create', 'edit','patch'])
        "/api/cxp/notas/aplicar/$id"(controller:'notaDeCreditoCxP', action: 'aplicar', method: 'PUT')
        "/api/cxp/notas/print/$id"(controller: 'notaDeCreditoCxP', action: 'print', method: 'GET')


        "/api/cxp/pagos"(resources: 'pago', excludes:['create', 'edit','patch'])
        "/api/cxp/pagos/aplicar/$id"(controller:'pago', action: 'aplicar', method: 'PUT')
        "/api/cxp/pagos/search"(controller: 'pago', action: 'search')

        "/api/cxp/aplicaciones"(resources: 'aplicacionDePago', excludes:['create', 'edit','patch'])


        "/api/coms"(resources: 'recepcionDeCompra'){
            "/partidas"(resources: 'recepcionDeCompraDet', excludes:['create', 'edit','patch'])
        }
        "/api/coms/pendientesDeAnalisis/$id"(controller: 'recepcionDeCompra', action: 'pendientesDeAnalisis')

        "/api/costos"(resources: 'costoPromedio', excludes:['create', 'edit','patch', 'update', 'save'])
        "/api/costos/generar/$ejercicio/$mes"(controller: 'costoPromedio', action: 'generar', method: 'POST')
        "/api/costos/calcular/$ejercicio/$mes"(controller: 'costoPromedio', action: 'calcular', method: 'POST')
        "/api/costos/aplicar/$ejercicio/$mes"(controller: 'costoPromedio', action: 'aplicar', method: 'POST')
        "/api/costos/generarReporte/$ejercicio/$mes"(controller: 'costoPromedio', action: 'generarReporte')


        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
