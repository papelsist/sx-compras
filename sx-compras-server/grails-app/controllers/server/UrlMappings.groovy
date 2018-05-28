package server

class UrlMappings {

    static mappings = {

        "/api/lineas"(resources: 'linea')
        "/api/marcas"(resources: 'marca')
        "/api/productos"(resources: 'producto')
        "/api/proveedores"(resources: 'proveedores')

        "/"(controller: 'application', action:'index')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
