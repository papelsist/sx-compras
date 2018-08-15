package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import sx.core.LogUser


@GrailsCompileStatic
@Service(Contrarecibo)
abstract class ContrareciboService implements LogUser {

    abstract Contrarecibo save( Contrarecibo recivo)

    abstract void delete(Serializable id)

    Contrarecibo saveRecibo(Contrarecibo  recibo) {
        logEntity(recibo)
        return save(recibo)
    }

    Contrarecibo update(Contrarecibo recibo) {
        recibo.partidas.each {
            it.contrarecibo = recibo.id
        }
        recibo.partidas.each { CuentaPorPagar cxp ->
            if(cxp.proveedor.fechaRevision) {
                def plazo = cxp.proveedor.plazo ?: 0
                cxp.vencimiento = recibo.fecha + plazo
                cxp.save flush: true
            }
        }
        Contrarecibo res = save(recibo)
        cleanFaltantes(res)
        return res
    }

    void cleanFaltantes(Contrarecibo recibo) {
        def facturas = CuentaPorPagar.where{contrarecibo == recibo.id}.list()
        def faltantes = facturas.findAll{ !recibo.partidas.contains(it)}
        faltantes.each {
            it.contrarecibo = null
            it.save flush: true
        }
    }






}
