package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j

@Slf4j
@Service(NotaDeCreditoCxP)
@GrailsCompileStatic
abstract class NotaDeCreditoCxPService {

    abstract NotaDeCreditoCxP save(NotaDeCreditoCxP nota)

    NotaDeCreditoCxP generarNota(ComprobanteFiscal cfdi) {
        assert cfdi.tipoDeComprobante == 'E', 'No es CFDI de Ingreso'
        NotaDeCreditoCxP nota = NotaDeCreditoCxP.where{uuid == cfdi.uuid}.find()
        if(nota)
            return nota

        nota = new NotaDeCreditoCxP([
            proveedor: cfdi.proveedor,
            nombre: cfdi.proveedor.nombre,
            folio: cfdi.folio,
            serie: cfdi.serie,
            fecha: cfdi.fecha,
            moneda: Currency.getInstance(cfdi.moneda),
            tipoDeCambio: cfdi.tipoDeCambio,
            subTotal: cfdi.subTotal ?: 0.0,
            impuestoTrasladado: cfdi.impuestoTrasladado ?: 0.0,
            impuestoRetenido: cfdi.impuestoRetenido?: 0.0,
            total: cfdi.total,
            comprobanteFiscal: cfdi,
            uuid: cfdi.uuid,
        ])
        nota = save(nota)
        return nota
    }
}
