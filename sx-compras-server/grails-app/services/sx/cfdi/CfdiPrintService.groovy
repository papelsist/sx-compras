package sx.cfdi

import grails.core.GrailsApplication
import groovy.util.logging.Slf4j

import org.springframework.context.ResourceLoaderAware
import org.springframework.core.io.Resource
import org.springframework.core.io.ResourceLoader

import grails.web.context.ServletContextHolder

import sx.cfdi.v33.NotaDeCargoPdfGenerator
import sx.cfdi.v33.V33PdfGenerator
import sx.cxc.NotaDeCargo
import sx.reports.ReportService

/**
 * Servicios de impresion de facturas centralizados
 *
 */
@Slf4j
class CfdiPrintService implements  ResourceLoaderAware {

    ResourceLoader resourceLoader

    CfdiLocationService cfdiLocationService

    ReportService reportService

    GrailsApplication grailsApplication

    def getPdf(Cfdi cfdi){

        if(cfdi.uuid == null) {
            throw new RuntimeException("CFDI ${cfdi.id} SIN TIMBRAR")
        }

        String fileName = cfdi.fileName.replaceAll(".xml", ".pdf")
        File file = new File(cfdiLocationService.getCfdiLocation(cfdi), fileName)
        log.info('Expected pdf file: {}', file.path)

        if(file.exists()){
            return file
        } else {
            log.info('No existe el PDF: ${fileName}  GENERANDOLO')
            Byte[] xmlData = cfdiLocationService.getXml(cfdi, true)
            ByteArrayOutputStream out = generarPdf(cfdi, xmlData)
            file.setBytes(out.toByteArray())
            return file
        }
    }

    def generarPdf(Cfdi cfdi, Byte[] xmlData) {
        log.info('Generando PDF para {} {}-{}', cfdi.origen, cfdi.serie, cfdi.folio)
        switch (cfdi.origen) {
            case 'NOTA_CARGO':
                NotaDeCargo notaDeCargo = NotaDeCargo.where{cfdi == cfdi}.find()
                return generarPdfNotaDeCargo(notaDeCargo, xmlData)
            default:
                throw new RuntimeException('ORIGEN DE CFDI INCORRECTO. NO AS PUEDE GENERAR PDF CFDI: {}', cfdi.id)
        }
    }

    def generarPdfNotaDeCargo(NotaDeCargo nota, Byte[] xmlData) {
        log.info('Nota de cargo: {} ', nota.id)
        /*
        Resource realPath = resourceLoader.getResource("/reports")

        log.info('Report: {} Exists: {} Path: {}', realPath.filename, realPath.exists(), realPath.getFile().getAbsolutePath())
        */
        def data = NotaDeCargoPdfGenerator.getReportData(nota, xmlData)
        Map parametros = data['PARAMETROS']

        // LOGO

        def realPath = grailsApplication.mainContext.servletContext.getRealPath("/reports") ?: 'reports'
        parametros.LOGO = realPath + '/PAPEL_CFDI_LOGO.jpg'
        // Resource logoResource = resourceLoader.getResource("/reports/PAPEL_CFDI_LOGO.jpg")
        // log.info('Logo exists: {}, Path{}', logoResource.exists(), logoResource.getURI().path)
        // parametros.LOGO = 'reports/PAPEL_CFDI_LOGO.jpg'
        // parametros.LOGO = logoResource.getURL().path

        return reportService.run('cfdis/PapelCFDI3Nota.jrxml', data['PARAMETROS'], data['CONCEPTOS'])

    }

    def generarPdfFactura(Cfdi cfdi){
        def realPath = ServletContextHolder.getServletContext().getRealPath("reports") ?: 'reports'
        def data = V33PdfGenerator.getReportData(cfdi, cfdiLocationService.getXml(cfdi), true)
        Map parametros = data['PARAMETROS']
        parametros.PAPELSA = realPath + '/PAPEL_CFDI_LOGO.jpg'
        parametros.IMPRESO_IMAGEN = realPath + '/Impreso.jpg'
        parametros.FACTURA_USD = realPath + '/facUSD.jpg'
        return reportService.run('PapelCFDI3.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    }
}
