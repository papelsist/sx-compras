package sx.sat

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.TupleConstructor
import groovy.transform.builder.Builder
import groovy.util.slurpersupport.GPathResult

@ToString( includes =   "ejercicio, mes, tipo, fileName")
@EqualsAndHashCode
// @TupleConstructor(includes = 'ejercicio,mes,tipo')
// @Builder( excludes = 'ultimaModificacion, acuse, createUser, updateUser')
@GrailsCompileStatic
class BalanzaSat {

    Integer ejercicio

    Integer mes

    String tipo = 'N'

    /**
     * Fecha de la ultima modificacion contable
     */
    String ultimaModificacion

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
        tipo inList: ['N', 'C']
        xml maxSize:(1024 * 512)  // 50kb para almacenar el xml
        acuse nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        ultimaModificacion nullable: true
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping ={
        // partidas cascade: "all-delete-orphan"
        ultimaModificacion type:'date'
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
