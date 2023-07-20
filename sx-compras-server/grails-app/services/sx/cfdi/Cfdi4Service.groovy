package sx.cfdi

import javax.xml.bind.JAXBContext
import javax.xml.bind.Marshaller



import grails.gorm.transactions.Transactional
import grails.util.Environment
import grails.web.context.ServletContextHolder

import com.cfdi4.Cfdi4Utils
import com.cfdi4.comprobante.Pagos
import com.cfdi4.comprobante.Comprobante

import sx.core.AppConfig
import sx.core.Venta
import sx.reports.ReportService
import sx.cfdi.v33.V33PdfGenerator

@Transactional
class Cfdi4Service {

    private AppConfig config

    ReportService reportService

    CfdiEdicomService cfdiEdicomService

    def grailsApplication

    Cfdi generarCfdi(Comprobante comprobante, String tipo, String origen = 'VENTA') {
        println "Ejecutando el cfdi4Service para Version 4 del cfdi"
        Cfdi cfdi = new Cfdi()
        cfdi.tipoDeComprobante = tipo
        cfdi.fecha = Date.parse( "yyyy-MM-dd'T'HH:mm:ss", comprobante.fecha,)
        cfdi.serie = comprobante.serie
        cfdi.folio = comprobante.folio
        cfdi.emisor = comprobante.emisor.nombre
        cfdi.emisorRfc = comprobante.emisor.getRfc()
        cfdi.receptor = comprobante.receptor.nombre
        cfdi.receptorRfc = comprobante.receptor.rfc
        cfdi.total = comprobante.total
        cfdi.origen = origen
        cfdi.versionCfdi = '4.0'
        cfdi.fileName = getFileName(cfdi)
        try {
            byte[] data
            if(cfdi.tipoDeComprobante == 'P') {
                println "Generando el XML para el pago"
                // data = PagosUtils.serialize(comprobante).bytes
                data = toXmlByteArrayDePago(comprobante)
            } else {
                // data = CfdiUtils.toXmlByteArray(comprobante)
                data = toXmlByteArray(comprobante)
                // data = CfdiUtils.serialize(comprobante).bytes
            }
            
            saveXml(cfdi, data)
            println cfdi.properties
            cfdi.save failOnError: true, flush:true
            return cfdi
        }catch (Exception ex) {
            ex.printStackTrace()
            return null
        }

    }

    void saveXml(Cfdi cfdi, byte[] data){
        println "Salvando el CFDI para la Version 4"
        def date = cfdi.fecha
        String year = date[Calendar.YEAR]
        String month = date[Calendar.MONTH]+1
        String day = date[Calendar.DATE]
        def cfdiRootDir = new File(getCfdiLocation())
        final FileTreeBuilder treeBuilder = new FileTreeBuilder(cfdiRootDir)
        treeBuilder{
            dir(cfdi.emisor){
                dir(year){
                    dir(month){
                        dir(day){
                            File res = file(cfdi.fileName) {
                                setBytes(data)
                            }
                            cfdi.url = res.toURI().toURL()
                        }
                    }
                }
            }
        }
    }

    def save(Comprobante comprobante, String dirPath, String fileName){

        File dir = new File(dirPath)
        if(!dir.exists()) {
            dir.mkdirs()
        }
        byte[] data = CfdiUtils.toXmlByteArray(comprobante)
        File xmlFile = new File(dir, fileName);
        FileOutputStream os = new FileOutputStream(xmlFile, false)
        os.write(data)
        os.flush()
        os.close()
    }


    private getDirPath(Cfdi cfdi) {
        String dirPath = "${getConfig().cfdiLocation}/${cfdi.emisor}/${cfdi.fecha.format('YYYY')}/${cfdi.fecha.format('MM')}"
        return dirPath
    }

    private getFileName(Cfdi cfdi){
        String name = "${cfdi.receptorRfc}-${cfdi.serie}-${cfdi.folio}.xml"
        return name
    }


    AppConfig getConfig() {
        if(!this.config){
            this.config = AppConfig.first()
        }
        return this.config
    }

    def getCfdiLocation() {
        if(Environment.current == Environment.DEVELOPMENT){
            return System.properties['user.home'] + '/cfdis'
        } else {
            return getConfig().cfdiLocation
        }
    }

    def cancelar(Cfdi cfdi) {
        if (cfdi.uuid) {
            // Todo Cancelar en el SAT
        } else {
            cfdi.delete flush:true
        }
    }

    def enviar(Cfdi cfdi, String targetEmail) {
        assert !cfdi.cancelado, "CFDI ${cfdi.serie} ${cfdi.folio}  cancelado no se puede enviar por correo"
        assert cfdi.uuid, "El CFDI ${cfdi.serie} ${cfdi.folio} no se ha timbrado"
        if (cfdi.origen == 'VENTA') {
            Venta venta = Venta.where {cuentaPorCobrar.cfdi == cfdi}.find()
            assert venta, "No existe la venta origen del cfdi: ${cfdi.id}"
            String email = targetEmail ?: venta.cliente.getCfdiMail()
            if (!email) {
                cfdi.comentario = "CLIENTE ${venta.cliente.getCfdiMail()} SIN CORREO PARA ENVIO DE EMAIL "
                cfdi.save flush: true
                return cfdi
            }
            return enviarFacturaEmail(cfdi, venta, email)
        }
    }

    def enviarFacturaEmail(Cfdi cfdi, Venta factura, String targetEmail) {
        log.debug('Enviando cfdi {} {} al correo: {}', cfdi.serie,cfdi.folio, targetEmail)
        def xml = getXml(cfdi)
        def pdf = generarImpresionV33(cfdi, true).toByteArray()

        String message = """Apreciable cliente por este medio le hacemos llegar la factura electrónica de su compra. Este correo se envía de manera autmática favor de no responder a la dirección del mismo. Cualquier duda o aclaración
            la puede dirigir a: servicioaclientes@papelsa.com.mx
        """
        sendMail {
            multipart false
            from 'facturacion@papelsa.mobi'
            to targetEmail
            subject "Envio de CFDI Serie: ${cfdi.serie} Folio: ${cfdi.folio}"
            html "<p>${message}</p> "
            attach("${cfdi.uuid}.xml", 'text/xml', xml)
            attach("${cfdi.uuid}.pdf", 'application/pdf', pdf)
        }
        cfdi.enviado = new Date()
        cfdi.email = targetEmail
        cfdi.save flush: true
    }

    private generarImpresionV33( Cfdi cfdi) {
        def logoPath = ServletContextHolder.getServletContext().getRealPath("reports/PAPEL_CFDI_LOGO.jpg")
        def data = V33PdfGenerator.getReportData(cfdi, getXml(cfdi),true)
        Map parametros = data['PARAMETROS']
        parametros.PAPELSA = logoPath
        return reportService.run('PapelCFDI3.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
    }

    Byte[] getXml(Cfdi cfdi){
        String fileName = cfdi.url.getPath().substring(cfdi.url.getPath().lastIndexOf('/')+1)
        File file = new File(getCfdiDir(cfdi), fileName)
        return file.getBytes()
    }

    def getCfdiLocation(Cfdi cfdi){
        File dir = getCfdiDir(cfdi);
        String subDir = "${cfdi.fecha[Calendar.YEAR]}/${cfdi.fecha[Calendar.MONTH]+1}/"
        File targetDir = new File(dir, subDir)
        if(!targetDir.exists()){
            targetDir.mkdir()
        }
        return targetDir;
    }

    def getCfdiDir(Cfdi cfdi) {
        String cfdiDirPath = grailsApplication.config.getProperty('sx.cfdi.dir')
        File cfdiDir = new File(cfdiDirPath)
        assert cfdiDir.isDirectory(), cfdiDir.path + ' No es dierctorio'
        assert cfdiDir.exists(), 'No existe el directorio: ' + cfdiDir.path
        return cfdiDir
    }


    def toXmlByteArray(Comprobante comprobante){
        JAXBContext context = JAXBContext.newInstance(Comprobante.class)
        Marshaller marshaller = context.createMarshaller()
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true)
        String xsiSchemaLocation = "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"
        marshaller.setProperty(Marshaller.JAXB_SCHEMA_LOCATION, xsiSchemaLocation)

        ByteArrayOutputStream os = new ByteArrayOutputStream()
        marshaller.marshal(comprobante, os)
        return os.toByteArray()
    }


    def toXmlByteArrayDePago(Comprobante comprobante){
        StringWriter writer = new StringWriter()
        JAXBContext context = JAXBContext.newInstance(Comprobante.class, Pagos.class)
        String xsiSchemaLocation = "http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://www.sat.gob.mx/Pagos20 http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xsd"
        Marshaller marshaller = context.createMarshaller()
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT,true)
        marshaller.setProperty(Marshaller.JAXB_SCHEMA_LOCATION,xsiSchemaLocation)

        ByteArrayOutputStream os = new ByteArrayOutputStream()
        marshaller.marshal(comprobante, os)
        return os.toByteArray()
    }





}
