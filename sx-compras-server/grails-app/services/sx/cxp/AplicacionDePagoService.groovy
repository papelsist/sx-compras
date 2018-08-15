package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j



@Slf4j
@GrailsCompileStatic
@Service(AplicacionDePago)
abstract class AplicacionDePagoService {

    abstract AplicacionDePago save(AplicacionDePago aplicacionDePago)



    AplicacionDePago saveAplicacionDeNota(AplicacionDePago aplicacionDePago) {
        NotaDeCreditoCxP nota = aplicacionDePago.nota
        BigDecimal disponible = nota.disponible
        if(disponible ) {
            BigDecimal importe = disponible >= aplicacionDePago.importe ? aplicacionDePago.importe : disponible
            aplicacionDePago.importe = importe
            aplicacionDePago.formaDePago = 'COMPENSACION'
            aplicacionDePago.fecha?: new Date()
            return save(aplicacionDePago)
        }
        return aplicacionDePago
    }

    AplicacionDePago addAplicacionDePago(AplicacionDePago aplicacionDePago) {

    }

    abstract void delete(Serializable id)




}
