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
        buildPartidas(cfdi).each {
            nota.addToConceptos(it)
        }
        setTipoDeRelacion(nota)
        nota = save(nota)
        return nota
    }

    @CompileDynamic
    void setTipoDeRelacion(NotaDeCreditoCxP nota ) {
        ComprobanteFiscal cfdi = nota.comprobanteFiscal
        GPathResult xml = cfdi.getXmlNode()
        def node = xml.breadthFirst().find { it.name() == 'CfdiRelacionados'}
        if(node) {
            def tipoDeRelacion = node.attributes()['TipoRelacion']
            nota.tipoDeRelacion = tipoDeRelacion
            switch (tipoDeRelacion) {
                case '01':
                    nota.concepto = 'DESCUENTO'
                    break
                case '03':
                    nota.concepto = 'DEVOLUCION'
                    break
                default:
                    nota.concepto = 'DESCUENTO'
            }
        }
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
                    det.cxp = cxp
                }
                res << det
            }

        }
        return res
    }

    NotaDeCreditoCxP aplicar(NotaDeCreditoCxP nota) {
        BigDecimal disponible = nota.disponible
        if(disponible) {
            nota.conceptos.each {
                CuentaPorPagar cxp = it.cxp
                BigDecimal saldo = cxp.saldo
                if(saldo) {
                    BigDecimal importe = saldo <= disponible ? saldo : disponible
                    disponible = disponible - importe
                    AplicacionDePago aplicacion = new AplicacionDePago()
                    aplicacion.fecha = nota.fecha
                    aplicacion.comentario = nota.concepto
                    aplicacion.cxp = cxp
                    aplicacion.nota = nota
                    aplicacion.importe = importe
                    aplicacion.formaDePago = 'COMPENSACION'
                    aplicacion.save failOnError: true, flush: true
                }
            }
            nota.refresh()
            log.debug("Nota aplicado:{}  ", nota.aplicado)
            return nota
        }
        return nota
    }
}
