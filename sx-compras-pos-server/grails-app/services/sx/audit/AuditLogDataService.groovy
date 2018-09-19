package sx.audit

import grails.gorm.services.Service
import groovy.transform.CompileStatic

@CompileStatic
@Service(AuditLog)
interface AuditLogDataService {

    AuditLog save(AuditLog log)
}

