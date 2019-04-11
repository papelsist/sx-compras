package sx.cxc

import grails.gorm.transactions.Transactional
import sx.core.FolioLog
import sx.core.LogUser

@Transactional
class SolicitudDeDepositoService implements  LogUser, FolioLog{

    SolicitudDeDeposito save(SolicitudDeDeposito solicitud) {
        if(!solicitud.id) {
            solicitud.folio = nextFolio('SOLICITUDES_DEPOSITO', 'CHO')
        }
        logEntity(solicitud)
        solicitud.save failOnError: true, flush: true
        return solicitud

    }
}
