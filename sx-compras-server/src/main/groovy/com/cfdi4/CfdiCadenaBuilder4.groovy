package com.cfdi4

import groovy.util.logging.Slf4j

import javax.xml.transform.Source
import javax.xml.transform.Transformer
import javax.xml.transform.TransformerFactory
import javax.xml.transform.dom.DOMSource
import javax.xml.transform.stream.StreamResult
import javax.xml.transform.stream.StreamSource
import grails.util.Environment

import com.cfdi4.comprobante.Comprobante



@Slf4j
class CfdiCadenaBuilder4 {


    String xsltUrl = "http://www.sat.gob.mx/sitio_internet/cfd/4/cadenaoriginal_4_0/cadenaoriginal_4_0.xslt"
    // tring xsltUrl = "http://www.papelsa.com.mx/cfdi/cadenaoriginal_3_3.xslt"

    private Transformer transformer;

    String build(Comprobante comprobante){
        println "Generando la cadena original para cfdiV4"
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
    /*
    public Transformer getTransformer() {
        if (!this.transformer) {
            TransformerFactory factory=TransformerFactory.newInstance()
            StreamSource source = new StreamSource(xsltUrl)
            this.transformer = factory.newTransformer(source)
        }
        return this.transformer;
    }
    */
    Transformer getTransformer() {
        println "Obteniendo el transformer para cfdiV4"
        if (!this.transformer) {
            TransformerFactory factory=TransformerFactory.newInstance()
            StreamSource source
            if(Environment.current == Environment.DEVELOPMENT) {
                String userHome = System.getProperty('user.home')
                source = new StreamSource(new File("${userHome}/dumps/xslt4/cadenaoriginal.xslt"))
                // source = new StreamSource('http://www.sat.gob.mx/sitio_internet/cfd/3/cadenaoriginal_3_3/cadenaoriginal_3_3.xslt')
            } else {
                source = new StreamSource(new File('/home/xslt4/cadenaoriginal.xslt'))
            }
            //StreamSource source   = new StreamSource(xsltUrl)
            // StreamSource source = new StreamSource(new File('/Users/rubencancino/dumps/cfdi/cadenaoriginal_3_3.xslt'))
            this.transformer = factory.newTransformer(source)
        }
        return this.transformer
    }

    StreamSource buildSource(Comprobante comprobante) {
        println "Construyendo el source para cfdiV4"
        String xml = Cfdi4Utils.serialize(comprobante)
        Reader reader = new StringReader(xml)
        return  new StreamSource(reader)
    }

}