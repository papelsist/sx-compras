package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*


@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ListaDePreciosProveedorController extends RestfulController<ListaDePreciosProveedor> {

    static responseFormats = ['json']
    ListaDePreciosProveedorService listaDePreciosProveedorService
    ListaDePreciosProveedorController() {
        super(ListaDePreciosProveedor)
    }

    @Override
    protected List<ListaDePreciosProveedor> listAllResources(Map params) {
        log.debug('List: {}', this.params)
        if(params.proveedorId)
            return ListaDePreciosProveedor.where{ proveedor.id == params.proveedorId}.list()
        return super.listAllResources(params)
    }

    @Override
    protected ListaDePreciosProveedor saveResource(ListaDePreciosProveedor resource) {
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

    def aplicar(ListaDePreciosProveedor lista) {
        if(lista == null ){
            notFound()
            return
        }
        respond listaDePreciosProveedorService.aplicarListaDePrecios(lista)
    }
}
