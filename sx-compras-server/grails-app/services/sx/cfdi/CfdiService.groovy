package sx.cfdi

import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value

import grails.gorm.transactions.Transactional

import javax.xml.XMLConstants
import javax.xml.bind.JAXBContext
import javax.xml.bind.Marshaller

import lx.cfdi.v33.CfdiUtils
import lx.cfdi.v33.Comprobante
import lx.cfdi.v33.pagos.PagosUtils
import sx.core.LogUser
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Transactional
class CfdiService implements  LogUser{

    @Value('${siipapx.cfdi.dir}')
    String cfdisDir

    ReportService reportService

    Cfdi generarCfdi(Comprobante comprobante, String tipo, String origen) {
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
        cfdi.fileName = "${cfdi.serie}-${cfdi.folio}.xml"

        byte[] data
        if(cfdi.tipoDeComprobante == 'P') {
            data = PagosUtils.toXmlByteArray(comprobante)
        } else {
            data = toXmlByteArray(comprobante) //CfdiUtils.toXmlByteArray(comprobante)
        }
        saveXml(cfdi, data)
        logEntity(cfdi)
        cfdi.save failOnError: true, flush:true
        return cfdi
    }

    void saveXml(Cfdi cfdi, byte[] data){

        Date date = cfdi.fecha
        String year = date[Calendar.YEAR]
        String month = date[Calendar.MONTH] + 1

        def cfdiRootDir = new File(cfdisDir)

        final FileTreeBuilder treeBuilder = new FileTreeBuilder(cfdiRootDir)
        treeBuilder{
            dir(year){
                dir(month){
                    File res = file(cfdi.fileName) {
                        setBytes(data)
                    }
                    cfdi.url = res.toURI().toURL()
                }
            }
        }
    }

    def toXmlByteArray(Comprobante comprobante){
        JAXBContext context = JAXBContext.newInstance(Comprobante.class)
        Marshaller marshaller = context.createMarshaller()
        marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true)
        String xsiSchemaLocation = "http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"
        marshaller.setProperty(Marshaller.JAXB_SCHEMA_LOCATION, xsiSchemaLocation)
    
        ByteArrayOutputStream os = new ByteArrayOutputStream()
        marshaller.marshal(comprobante, os)
        return os.toByteArray()
    }

}
