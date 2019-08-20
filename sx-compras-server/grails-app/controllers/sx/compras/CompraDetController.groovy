package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic


@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class CompraDetController extends RestfulController<CompraDet> {
    
    static responseFormats = ['json']
    
    CompraDetController() {
        super(CompraDet)
    }

    @Override
    protected List<CompraDet> listAllResources(Map params) {
        String compraId = params.compraId
        return CompraDet.where{ compra.id == compraId}.list()
    }

    @CompileDynamic
    def  depuracionBatch() {
        log.info('Depuracion BULK: {}', params)
        String xids = params.ids as String
        String[] ids = xids.split(',')
        String dd = ""
        def limit = ids.length - 1
        0.upto(limit, { item ->
            String rq = "'${ids[item]}'"
            dd += rq
            if(item < limit) {
                dd += ","
            }
        })
        String hql = """
            update CompraDet d set d.depurecaio = :dep and d.depurado = d.pendiente
            where d.id in(${dd})
        """
        def res = CompraDet.executeUpdate(hql, [dep: new Date(), ids: dd])
        respond res
    }
}
