package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult

@Slf4j
@Service(NotaDeCreditoCxP)
@GrailsCompileStatic
abstract class NotaDeCreditoCxPService {

    abstract NotaDeCreditoCxP save(NotaDeCreditoCxP nota)

    NotaDeCreditoCxP generarNota(ComprobanteFiscal cfdi) {
        if(cfdi.versionCfdi != '3.3') {
            log.debug('CFDI no es  ver 3.3')
            return null
        }
        if(cfdi.tipoDeComprobante != 'E') {
            log.debug('CFDI no es  Egreso')
            return null
        }

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
            concepto: 'DESCUENTO'
        ])
        nota.concepto = getTipoDeNota(cfdi)
        buildPartidas(cfdi).each {
            nota.addToConceptos(it)
        }
        nota = save(nota)
        return nota
    }

    @CompileDynamic
    String getTipoDeNota(ComprobanteFiscal cfdi) {
        GPathResult xml = cfdi.getXmlNode()
        def node = xml.breadthFirst().find { it.name() == 'CfdiRelacionados'}
        if(node) {
            def tipoDeRelacion = node.attributes()['TipoRelacion']
            switch (tipoDeRelacion) {
                case '01':
                    return 'DESCUENTO'
                case '03':
                    return 'DEVOLUCION'
                default:
                    return 'DESCUENTO'
            }
        }
        return 'DESCUENTO'
    }

    @CompileDynamic
    List<NotaDeCreditoCxPDet> buildPartidas(ComprobanteFiscal cfdi) {
        List<NotaDeCreditoCxPDet> res =  []
        GPathResult xml = cfdi.getXmlNode()
        def node = xml.breadthFirst().find { it.name() == 'CfdiRelacionados'}
        if(node) {
            def tipoDeRelacion = node.attributes()['TipoRelacion']
            node.CfdiRelacionado.each {
                String uuid = it.@UUID
                CuentaPorPagar cxp = CuentaPorPagar.where{uuid == uuid}.find()
                NotaDeCreditoCxPDet det = new NotaDeCreditoCxPDet()
                det.uuid = uuid
                if(cxp) {
                    println "UUID: ${uuid} Cfdi: ${cxp.serie} ${cxp.folio}"
                    det.fechaDocumento = cxp.fecha
                    det.totalDocumento = cxp.total
                    det.cxp = cxp
                    det.folio = cxp.folio
                    det.serie = cxp.serie
                    det.saldoDocumento = cxp.saldo
                }
                res << det
            }

        }
        return res
    }
}
