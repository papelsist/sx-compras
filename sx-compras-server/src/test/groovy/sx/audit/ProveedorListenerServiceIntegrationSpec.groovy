package sx.audit

import grails.testing.mixin.integration.Integration
import org.apache.commons.lang3.RandomStringUtils
import spock.lang.Specification
import spock.util.concurrent.PollingConditions
import sx.core.Proveedor
import sx.core.ProveedorService

@Integration
class ProveedorListenerServiceIntegrationSpec extends  Specification{

    ProveedorService proveedorService
    ProveedorLogDataService proveedorLogDataService



    void "saving a Proveedor should cause an ProveedorLog instance to be saved"() {

        when:
        def conditions = new PollingConditions(timeout: 30)

        println "Proveedores: " +  proveedorService.count()

        Proveedor proveedor = proveedorService.save(new Proveedor(
                nombre: 'RUBEN CANCINO RAMOS',
                clave: 'RRR2'
        ))

        then:
        proveedor
        proveedor.id
        conditions.eventually {
            assert proveedorLogDataService.count() == old(proveedorLogDataService.count()) + 1
        }

        when:
        ProveedorLog lastLog = this.lastLog()

        then:
        lastLog.event == "SAVE"
        lastLog.proveedorId == proveedor.id

        cleanup:
            proveedorService.delete(proveedor.id)


    }



    void "Updating a Proveedor should cause an ProveedorLog instance to be saved"() {

        when: 'A Proveedor is updated'
        def conditions = new PollingConditions(timeout: 30)

        Proveedor proveedor = proveedorService.findByRfc('IMP901016J16')

        String tel = RandomStringUtils.random(10,false, true )

        proveedor.telefono1 = tel
        proveedor = proveedorService.save(proveedor)

        then: 'a new log instance is created'
        conditions.eventually {
            assert proveedorLogDataService.count() == old(proveedorLogDataService.count()) + 1
        }

        when:
        ProveedorLog lastLog = this.lastLog()

        then:
        proveedor.telefono1 == tel
        lastLog.event == 'UPDATE'
        lastLog.proveedorId == proveedor.id



    }

    ProveedorLog lastLog() {
        int offset = Math.max(((this.proveedorLogDataService.count() as int) - 1), 0)
        this.proveedorLogDataService.findAll([max: 1, offset: offset]).first()
    }



}
