package sx.sat

import grails.compiler.GrailsCompileStatic

import groovy.transform.Canonical
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.builder.Builder
import groovy.util.slurpersupport.GPathResult
import groovy.xml.XmlUtil

import lx.econta.catalogo.Catalogo
import lx.econta.catalogo.CatalogoBuilder
import lx.econta.catalogo.Cuenta

/**
 * Enidad para registrar la generacion generacion del archivo XML correspondiente al catalogo de cuentas segun el
 * anexo 24 del SAT definido en archivo:
 * <a href="http://omawww.sat.gob.mx/esquemas/ContabilidadE/1_3/CatalogoCuentas/CatalogoCuentas_1_3.xsd">
 *     CatalogoCuentas_1_3.xsd
 * </a>
 */
@ToString( includes = "emisor, rfc, ejercicio, mes")
@EqualsAndHashCode( includes = ['ejercicio', 'mes', 'rcf'])
@GrailsCompileStatic
class CatalogoDeCuentas {

    String id

    EcontaEmpresa empresa

    Integer ejercicio

    Integer mes

    String emisor

    String rfc

    String fileName

    String versionSat = '1.3'

    URL xmlUrl
    URL acuseUrl

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    Catalogo catalogo

    static constraints = {
        ejercicio inList:(2014..2030)
        mes inList:(1..13)
        xmlUrl url: true, nullable: false
        acuseUrl url: true, nullable: true
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping = {
        id generator:'uuid'
        table 'sat_econta_catalogo'
    }

    static transients = ['xmlNode', 'catalogo', 'cuentas']

    private GPathResult xmlNode

    GPathResult getXmlNode(){
        if(xmlNode == null) {
            xmlNode = new XmlSlurper().parse(new ByteArrayInputStream(xmlUrl.getBytes()))
        }
        return xmlNode
    }

    String  readXml() {
        return XmlUtil.serialize(getXmlNode())
        // return new String(this.xml, 'UTF-8')
    }

    Catalogo getCatalogo() {
        if(!this.catalogo) {
            CatalogoBuilder builder = CatalogoBuilder.newInstance()
            this.catalogo = builder.unmarshall(new ByteArrayInputStream(xmlUrl.getBytes()), false)
        }
        return this.catalogo
    }

    List<Cuenta> getCuentas() {
        return this.getCatalogo().getCuentas()
    }
}
