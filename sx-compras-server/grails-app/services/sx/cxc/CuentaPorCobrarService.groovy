package sx.cxc

import grails.gorm.transactions.Transactional
import sx.core.FolioLog
import sx.core.LogUser

@Transactional
class CuentaPorCobrarService implements LogUser, FolioLog{

    CuentaPorCobrar update(CuentaPorCobrar cxc) {
        logEntity(cxc)

    }
}
