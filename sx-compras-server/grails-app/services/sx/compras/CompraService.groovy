package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import sx.core.Folio
import sx.core.LogUser


@GrailsCompileStatic
@Service(ListaDePreciosProveedor)
@Slf4j
abstract class CompraService implements LogUser{

    abstract Compra save(Compra compra)

    abstract void delete(Serializable id)

    Compra saveCompra(Compra compra) {
        compra.folio = nextFolio()
        logEntity(compra)
        return save(compra)

    }

    Long  nextFolio(){
        Folio folio = Folio.findOrCreateWhere(entidad: 'COMPRAS', serie: 'OFICINAS')
        Long res = folio.folio + 1
        log.info('Asignando folio de compra: {}', res)
        folio.folio = res
        folio.save flush: true
        return res
    }

}
