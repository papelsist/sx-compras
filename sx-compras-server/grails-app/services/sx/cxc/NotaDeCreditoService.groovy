package sx.cxc

import grails.gorm.services.Service
import sx.core.FolioLog

@Service(NotaDeCredito)
abstract class NotaDeCreditoService implements FolioLog{

    protected abstract NotaDeCredito save(NotaDeCredito nota)

    abstract void delete(Serializable id)

    NotaDeCredito saveNota(NotaDeCredito nota) {
        nota.folio = nextFolio('NOTA_DE_CREDITO', 'BON')
        return save(nota)
    }
}




