package sx.audit

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import spock.lang.Specification
import sx.core.Proveedor

class ProveedorListenerServiceSpec extends Specification implements ServiceUnitTest<ProveedorLogListenerService>, DataTest{

    def setup() {
        mockDomains Proveedor
    }

    def cleanup() {
    }

    void "Proveedor.PostInsertEvent triggers proveedorLogDataService.save"(){
        given:
        service.proveedorLogDataService = Mock(ProveedorLogDataService)

        Proveedor proveedor = buildProveedor()
        println "Valid ${proveedor.validate()}"
        PostInsertEvent event = new PostInsertEvent(dataStore, proveedor)

        when:
        service.afterInsert(event)

        then:
        1 * service.proveedorLogDataService.save(_, _)
    }

    void "Proveedor.PostUpdateEvent triggers proveedorLogDataService.update"(){
        given:
        service.proveedorLogDataService = Mock(ProveedorLogDataService)

        Proveedor proveedor = buildProveedor()
        PostUpdateEvent event = new PostUpdateEvent(dataStore, proveedor)

        when:
        service.afterUpdate(event)

        then:
        1 * service.proveedorLogDataService.save(_, _)
    }

    private buildProveedor() {
        Proveedor proveedor = new Proveedor(
                nombre: 'RUBEN CANCINO RAMOS',
                clave: 'R001'
        )
        proveedor.save(failOnError: true)
        return proveedor
    }
}
