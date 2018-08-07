package sx.compras

import grails.buildtestdata.BuildDataTest
import grails.testing.services.ServiceUnitTest
import spock.lang.Specification
import sx.audit.CompraListenerService
import sx.core.Proveedor
import sx.core.Sucursal

//@Build(Compra)
class CompraListenerServiceSpec extends Specification implements ServiceUnitTest<CompraListenerService>, BuildDataTest{



    void setupSpec(){
        mockDomains(Compra, Proveedor, Sucursal)
    }

    void "Compra.PostInsertEvent should be triggerd after saved"() {
        when:
        Compra compra = Compra.build(comentario: 'COMPRA DE PRUEBA')

        then:
        1 * service.afterInsert(_, _)
        // PostInsertEvent event = new PostInsertEvent(dataStore, compra)
    }
}
