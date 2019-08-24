package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.validation.Validateable
import grails.web.databinding.WebDataBinding

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import groovy.transform.ToString


import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.tesoreria.CuentaDeBanco
import sx.utils.Periodo
import sx.core.LogUser
import sx.core.Sucursal


@Slf4j
@Secured(['ROLE_GASTOS', 'ROLE_COMPRAS'])
// @GrailsCompileStatic
class GastoDetController extends RestfulController<GastoDet> implements LogUser {
   
    static responseFormats = ['json']
    
    GastoDetController() {
        super(GastoDet)
    }

    @Override
    @CompileDynamic
    protected List<GastoDet> listAllResources(Map params) {
        log.info('List: {}', params)
        def periodo = params.periodo
        def query = GastoDet.where{cxp.id == params.cxpId}
        return query.list()
    }

    @Override
    protected GastoDet saveResource(GastoDet resource) {
        logEntity(resource)
        resource = resource.save flush: true
        return resource
    }

    @CompileDynamic
    def prorratear() {
        GastoDet gasto = GastoDet.get(params.id)
        CuentaPorPagar factura = gasto.cxp
        if (gasto == null) {
            notFound()
            return
        }
        ProrratearGasto command = new ProrratearGasto()
        command.properties = getObjectToBind()

        log.info('Prorratear gasto {} con: {}', gasto.id, command)

        if(command.data) {
            command.data.each {
                if(it.value) {
                    Map map = it.value
                    Sucursal sucursal = Sucursal.where{clave == map.key.toString()}.find()
                    BigDecimal imp = map.value
                    GastoDet det = new GastoDet()
                    det.properties = gasto.properties
                    det.sucursal = sucursal
                    det.importe = imp
                    if(gasto.cantidad == 1) {
                        det.valorUnitario = imp
                    }
                    det.save failOnError: true, flush: true
                }
            }
            gasto.delete flush: true
        }
        respond GastoDet.where{cxp == factura}.list()
    }
    

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }
}

@ToString
class ProrratearGasto implements WebDataBinding {
    Long gastoId
    Map data
}
