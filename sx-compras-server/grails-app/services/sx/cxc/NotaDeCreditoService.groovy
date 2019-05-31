package sx.cxc

import grails.gorm.services.Service
import sx.core.FolioLog

@Service(NotaDeCredito)
abstract class NotaDeCreditoService implements FolioLog{

    protected abstract NotaDeCredito save(NotaDeCredito nota)

    abstract void delete(Serializable id)

    NotaDeCredito saveNota(NotaDeCredito nota) {

        nota.folio = nextFolio('NOTA_DE_CREDITO', nota.serie)
        return save(nota)
    }

    private generarCobro(NotaDeCredito nota) {
        Cobro cobro = new Cobro()
        cobro.setCliente(nota.cliente)
        cobro.setFecha(new Date())
        cobro.importe = nota.total
        cobro.moneda = nota.moneda
        cobro.tipoDeCambio = nota.tc
        cobro.tipo = nota.tipoCartera
        cobro.comentario = nota.comentario
        cobro.createUser = nota.createUser
        cobro.updateUser = nota.updateUser
        cobro.sucursal = nota.sucursal
        cobro.referencia = nota.folio.toString()
        cobro.formaDePago = nota.tipo
        return cobro
    }
}




