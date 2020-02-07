package sx.cfdi.v33

import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import lx.cfdi.v33.CfdiUtils
import lx.cfdi.v33.Comprobante
import org.springframework.stereotype.Component

import javax.xml.transform.Transformer
import javax.xml.transform.TransformerFactory
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource

import grails.util.Environment

@Slf4j
@Component
@GrailsCompileStatic
class CfdiCadenaBuilder33 {

    // String xsltUrl = "http://www.sat.gob.mx/sitio_internet/cfd/3/cadenaoriginal_3_3/cadenaoriginal_3_3.xslt"
    // String xsltUrl = "http://www.sat.gob.mx/sitio_internet/cfd/3/cadenaoriginal_3_3/cadenaoriginal_3_3.xslt"
    // String xsltUrl = "http://www.papelsa.com.mx/cfdi/cadenaoriginal_3_3.xslt"

    private Transformer transformer

    String build(Comprobante comprobante){
        log.debug('Generando cadena original para comprobante {}', comprobante.folio)
        // Build transformer
        Transformer transformer = getTransformer()

        // Source
        StreamSource xmlSource = buildSource(comprobante)

        // Target
        Writer writer = new StringWriter()
        StreamResult target = new StreamResult(writer)

        transformer.transform(xmlSource, target)
        String cadena = writer.toString()
        log.debug('Cadena original generada: {}', cadena)
        return cadena
    }

    Transformer getTransformer() {
        if (!this.transformer) {
            TransformerFactory factory=TransformerFactory.newInstance()
            StreamSource source
            if(Environment.current == Environment.DEVELOPMENT) {
                source = new StreamSource(new File('/Users/rubencancino/dumps/cfdi/cadenaoriginal_3_3.xslt'))
            } else {
                source = new StreamSource(new File('/home/xslt/cadenaoriginal_3_3.xslt'))
            }
            //StreamSource source	= new StreamSource(xsltUrl)
            // StreamSource source = new StreamSource(new File('/Users/rubencancino/dumps/cfdi/cadenaoriginal_3_3.xslt'))
            this.transformer = factory.newTransformer(source)
        }
        return this.transformer
    }

    StreamSource buildSource(Comprobante comprobante) {
        String xml = CfdiUtils.serialize(comprobante)
        Reader reader = new StringReader(xml)
        return  new StreamSource(reader)
    }


}