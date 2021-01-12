package sx.sat

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.TupleConstructor
import groovy.transform.builder.Builder
import groovy.util.slurpersupport.GPathResult
import groovy.xml.XmlUtil
import lx.econta.balanza.Balanza
import lx.econta.balanza.BalanzaBuilder
import lx.econta.balanza.BalanzaDet

@ToString( includes =   "ejercicio, mes, tipo, fileName")
@EqualsAndHashCode( includes = ['ejercicio', 'mes', 'rcf'])
@GrailsCompileStatic
class BalanzaSat {

    String id

    EcontaEmpresa empresa

    Integer ejercicio

    Integer mes

    String tipo = 'N'

    /**
     * Fecha de la ultima modificacion contable
     */
    String ultimaModificacion

    String emisor

    String rfc

    String fileName

    String versionSat = '1.3'

    List<BalanzaDet> partidas
    Balanza balanza

    URL xmlUrl
    URL acuseUrl

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        ejercicio inList:(2014..2030)
        mes inList:(1..13)
        tipo inList: ['N', 'C']
        xmlUrl url: true, nullable: false
        acuseUrl url: true, nullable: true
        ultimaModificacion nullable: true
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping ={
        id generator:'uuid'
        ultimaModificacion type:'date'
        table 'sat_econta_balanza'
    }

    static transients = ['xmlNode', 'balanza', 'partidas']

    private GPathResult xmlNode


    GPathResult getXmlNode(){
        if(xmlNode == null) {
            xmlNode = new XmlSlurper().parse(new ByteArrayInputStream(xmlUrl.getBytes()))
        }
        return xmlNode
    }

    String  readXml() {
        return XmlUtil.serialize(getXmlNode())
    }

    Balanza getBalanza() {
        if(!this.balanza) {
            BalanzaBuilder builder = BalanzaBuilder.newInstance()
            this.balanza = builder.unmarshall(new ByteArrayInputStream(xmlUrl.getBytes()), false)
        }
        return this.balanza
    }

    List<BalanzaDet> getPartidas() {
        return this.getBalanza().getPartidas()
    }

}
