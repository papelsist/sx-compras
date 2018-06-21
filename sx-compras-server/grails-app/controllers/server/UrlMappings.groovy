package server

class UrlMappings {

    static mappings = {

        "/api/lineas"(resources: 'linea')
        "/api/marcas"(resources: 'marca')
        "/api/productos"(resources: 'producto')
        "/api/proveedores"(resources: 'proveedor')

        "/api/comprobanteFiscal"(resources: 'comprobanteFiscal')
        "/api/comprobanteFiscal/xml/$id"(controller: 'comprobanteFiscal', action: 'xml')
        "/api/comprobanteFiscal/pdf/$id"(controller: 'comprobanteFiscal', action: 'pdf')


        "/api/cuentaPorPagar"(resources: 'cuentaPorPagar')
        "/api/cuentaPorPagar/pendientesDeAnalisis/$proveedorId"(controller: 'cuentaPorPagar', action: 'pendientesDeAnalisis')

        "/api/analisisDeFactura"(resources: 'analisisDeFactura', excludes:['create', 'edit','patch']) {
            "/partidas"(resources: 'analisisDeFacturaDet', excludes:['create', 'edit','patch'])
        }
        "/api/analisisDeFactura/cerrar/$id"(controller: 'analisisDeFactura', action: 'cerrar', method: 'PUT')

        "/api/coms"(resources: 'recepcionDeCompra'){
            "/partidas"(resources: 'recepcionDeCompraDet', excludes:['create', 'edit','patch'])
        }
        "/api/coms/pendientesDeAnalisis/$id"(controller: 'recepcionDeCompra', action: 'pendientesDeAnalisis')


        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
