package sx.sat

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


import groovy.util.slurpersupport.GPathResult
import lx.econta.polizas.TipoSolicitud

@ToString( includes =   "ejercicio, mes, tipoDeSolicitud, fileName")
@EqualsAndHashCode
@GrailsCompileStatic
class PolizasDelPeriodoSat {

    Integer ejercicio

    Integer mes

    String versionSat = '1.3'

    String rfc

    String emisor

    TipoSolicitud tipoDeSolicitud

    String numOrden

    String numTramite

    String fileName

    byte[] xml
    byte[] acuse

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        ejercicio inList:(2014..2030)
        numOrden nullable: true
        numTramite nullable: true
        mes inList:(1..13)
        xml maxSize:(1024 * 512)  // 50kb para almacenar el xml
        acuse nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping ={}

    static transients = ['xmlNode']

    private GPathResult xmlNode

    GPathResult getXmlNode(){
        if(xmlNode == null) {
            xmlNode = new XmlSlurper().parse(new ByteArrayInputStream(xml))
        }
        return xmlNode
    }

    String  toXml() {
        return new String(this.xml, 'UTF-8')
    }
}
