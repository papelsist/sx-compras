package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import sx.reports.ReportService


@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ListaDePreciosProveedorController extends RestfulController<ListaDePreciosProveedor> {

    static responseFormats = ['json']

    ListaDePreciosProveedorService listaDePreciosProveedorService
    CompraService compraService
    ReportService reportService

    ListaDePreciosProveedorController() {
        super(ListaDePreciosProveedor)
    }

    @Override
    protected List<ListaDePreciosProveedor> listAllResources(Map params) {
        params.max = 1000
        if(params.proveedorId)
            return ListaDePreciosProveedor.where{ proveedor.id == params.proveedorId}.list()
        return super.listAllResources(params)
    }

    @Override
    protected ListaDePreciosProveedor saveResource(ListaDePreciosProveedor resource) {
        log.info('Salvando lista de precios {}', resource.proveedor)
        return listaDePreciosProveedorService.save(resource)
    }

    @Override
    protected ListaDePreciosProveedor updateResource(ListaDePreciosProveedor resource) {
        return listaDePreciosProveedorService.save(resource)
    }

    @Override
    protected ListaDePreciosProveedor createResource() {
        ListaDePreciosProveedor resource = new ListaDePreciosProveedor()
        bindData resource, getObjectToBind()
        resource.createUser = ''
        resource.updateUser = ''
        return resource
    }



    @Override
    protected void deleteResource(ListaDePreciosProveedor resource) {
        listaDePreciosProveedorService.delete(resource.id)
    }

    def aplicar(ListaDePreciosProveedor lista) {
        if(lista == null ){
            notFound()
            return
        }
        respond listaDePreciosProveedorService.aplicarListaDePrecios(lista)
    }

    def actualizar(ListaDePreciosProveedor lista) {
        if(lista == null ){
            notFound()
            return
        }
        respond listaDePreciosProveedorService.actualizarProductos(lista)
    }

    def actualizarCompras(ListaDePreciosProveedor lista) {
        if(lista == null ){
            notFound()
            return
        }
        Date fecha = params.getDate('fecha', 'dd/MM/yyyy')

        if(fecha) {
            List<Compra> selected = Compra.where {proveedor == lista.proveedor && fecha >= fecha }.list()
            // List<Compra> selected = compras.findAll { it.getStatus() != 'T'}
            List<Compra> updated = []
            selected.each { c ->
                updated << compraService.actualizarPrecios(c, lista)
            }
            respond updated
            return
        }
        respond lista
    }


    def print( ) {

        Map repParams = [ID: params.id]
        boolean descuentos = params.getBoolean('descuentos', false)
        if(descuentos) {
            def pdf =  reportService.run('ListaDePreciosDesc.jrxml', repParams)
            render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePrecios.pdf')
        } else {
            def pdf =  reportService.run('ListaDePrecios.jrxml', repParams)
            render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePrecios.pdf')
        }

    }
}
