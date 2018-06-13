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
        "/api/comprobanteFiscal/pendientes/$proveedorId"(controller: 'comprobanteFiscal', action: 'pendientes')

        "/api/analisisDeFactura"(resources: 'analisisDeFactura', excludes:['create', 'edit','patch']) {
            "/partidas"(resources: 'analisisDeFacturaDet', excludes:['create', 'edit','patch'])
        }

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
