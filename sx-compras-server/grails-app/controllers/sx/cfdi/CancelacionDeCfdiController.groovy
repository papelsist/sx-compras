package sx.cfdi

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService
import sx.utils.Periodo


@Secured(['ROLE_CXC', 'ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class CancelacionDeCfdiController extends RestfulController<CancelacionDeCfdi> {

    static responseFormats = ['json']

    ReportService reportService

    CfdiCanceladoService cfdiCanceladoService

    CancelacionService cancelacionService

    CancelacionDeCfdiController() {
        super(CancelacionDeCfdi)
    }

    @Override
    @CompileDynamic
    protected List listAllResources(Map params) {

        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.max?: 50
        log.info('List: {}', params)


        def criteria = new DetachedCriteria(CancelacionDeCfdi).build {}

        if(params.receptor) {
            def receptor = "${params.receptor}%"
            log.info('List por receptor: {}', receptor)
            criteria = criteria.build {
                cfdi {
                    ilike('receptor', receptor)
                }
            }
        }

        else if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            return CancelacionDeCfdi.findAll(
                    "from CancelacionDeCfdi c where date(c.cfdi.fecha) between ? and ? order by c.lastUpdated ",
            [periodo.fechaInicial, periodo.fechaFinal])

            /*
            return CancelacionDeCfdi.where{
                cfdi.fecha >= periodo.fechaInicial && cfdi.fecha <= periodo.fechaFinal
            }.list(params)
            */
        }
        return criteria.list(params)
    }

    def pendientes() {
        // CuentaPorCobrar Todos los Cfdis pendientes de cancelar
        def criteria = new DetachedCriteria(Cfdi).build {
            eq('status', 'CANCELACION_PENDIENTE')
        }
        respond criteria.list([sort:'lastUpdated', order: 'asc'])
    }

    def cancelar(Cfdi cfdi) {
        log.info('Cancelando cfdi: {}-{} F: {}, Total: {}', cfdi.serie, cfdi.folio, cfdi.fecha, cfdi.total)
        if(cfdi == null){
            notFound()
            return
        }
        CancelacionDeCfdi cancelacionDeCfdi = cancelacionService.cancelarCfdi(cfdi)
        respond cancelacionDeCfdi
    }

    def mostrarAcuse(CancelacionDeCfdi cancelacion){
        if(cancelacion == null ){
            notFound()
            return
        }
        String fileName = "${cancelacion.uuid}.xml"
        render (file: cancelacion.ack, contentType: 'text/xml', filename: fileName, encoding: "UTF-8")
    }

    def descargarAcuse(CancelacionDeCfdi cancelacion){
        if(cancelacion == null ){
            notFound()
            return
        }
        File file = File.createTempFile('temp_', 'xml')
        file.setBytes(cancelacion.ack)
        String fileName = "CANCELACION_${cancelacion.uuid}.xml"
        response.setHeader "Content-disposition", "attachment; filename=${fileName}"
        response.setHeader("Content-Length", "${file.length()}")
        response.setContentType("text/xml")
        InputStream contentStream = file.newInputStream()
        response.outputStream << contentStream
        webRequest.renderView = false

        // String fileName = "${cancelacion.uuid}.xml"
        // render (file: cancelacion.ack, contentType: 'text/xml', filename: fileName, encoding: "UTF-8")
    }



    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
