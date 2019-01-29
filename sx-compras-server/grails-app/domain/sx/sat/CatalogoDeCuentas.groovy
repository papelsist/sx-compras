package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import groovy.transform.Canonical
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.builder.Builder
import groovy.util.slurpersupport.GPathResult

/**
 * Enidad para registrar la generacion generacion del archivo XML correspondiente al catalogo de cuentas segun el
 * anexo 24 del SAT definido en archivo:
 * <a href="http://omawww.sat.gob.mx/esquemas/ContabilidadE/1_3/CatalogoCuentas/CatalogoCuentas_1_3.xsd">
 *     CatalogoCuentas_1_3.xsd
 * </a>
 */
@ToString( excludes = "id, version, xml, acuse")
@EqualsAndHashCode
// @Builder
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CatalogoDeCuentas {

    Integer ejercicio

    Integer mes

    String emisor

    String rfc

    String fileName

    byte[] xml
    byte[] acuse

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        ejercicio inList:(2014..2030)
        mes inList:(1..13)
        xml maxSize:(1024 * 512)  // 50kb para almacenar el xml
        acuse nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        createUser nullable: true
        updateUser nullable: true

    }

    static transients = ['xmlNode']

    private GPathResult xmlNode

    GPathResult getXmlNode(){
        if(xmlNode == null) {
            xmlNode = new XmlSlurper().parse(new ByteArrayInputStream(xml))
        }
        return xmlNode
    }

    String  readXml() {
        return new String(this.xml, 'UTF-8')
    }
}
