package sx.audit

import grails.gorm.services.Service
import groovy.transform.CompileStatic


@CompileStatic
@Service(ProveedorLog)
interface ProveedorLogDataService {

    ProveedorLog save(String event, String proveedorId)

    Long count()

    List<ProveedorLog> findAll(Map args)
}
