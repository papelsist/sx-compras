package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.util.slurpersupport.GPathResult
import sx.core.Proveedor

@ToString(includes ='emisorRfc, serie, folio, fileName, tipoDeComprobante',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, uuid')
class ComprobanteFiscal {

    String id

    byte[] xml
    String fileName
    String serie
    String folio
    Date fecha
    String tipo

    Proveedor proveedor
    String emisorNombre
    String emisorRfc

    String receptorNombre
    String receptorRfc

    String tipoDeComprobante
    String usoCfdi

    String uuid

    String metodoDePago
    String formaDePago

    String moneda
    BigDecimal tipoDeCambio

    //Importes
    BigDecimal subTotal = 0.0
    BigDecimal descuento = 0.0
    BigDecimal impuestoTrasladado
    BigDecimal impuestoRetenido
    BigDecimal total = 0.0

    String versionCfdi

    String comentario

    byte[] pdf
    byte[] acuse

    List<ComprobanteFiscalConcepto> conceptos = []


    Date dateCreated
    Date lastUpdated

    static constraints = {
        serie nullable:true,maxSize:255
        folio nullable:true,maxSize:255
        emisorNombre nullable: true
        emisorRfc minSize: 12, maxSize:13
        receptorNombre nullable: true
        receptorRfc minSize: 12, maxSize:13
        tipoDeComprobante inList: ['I','E','T', 'P', 'N']
        uuid maxSize:40,unique:true
        formaDePago nullable: true, maxSize:35
        metodoDePago nullable: true, maxSize:5
        moneda maxSize: 5
        tipoDeCambio scale: 6
        xml maxSize:(1024 * 512)  // 50kb para almacenar el xml
        pdf nullable: true , maxSize:(1024 * 512 * 20) // 10 MB
        acuse nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        comentario nullable: true
        usoCfdi maxSize: 10, nullable: true

        subTotal scale: 4
        descuento nullable: true, scale: 4
        impuestoTrasladado nullable: true, scale: 4
        impuestoRetenido nullable: true, scale: 4
        versionCfdi nullable:true

        tipo inList: ['COMPRAS', 'GASTOS', 'HONORARIOS', 'COMISIONES']

    }

    static  mapping = {
        id generator:'uuid'
        fecha index: 'CF_IDX1'
        uuid index: 'CF_IDX2'
        emisorRfc index: 'CF_IDX_3'
        conceptos cascade: "all-delete-orphan"
    }

    static hasMany =[conceptos: ComprobanteFiscalConcepto]

    static transients = ['xmlNode']

    private GPathResult xmlNode

    GPathResult getXmlNode(){
        if(xmlNode == null) {
            xmlNode = new XmlSlurper().parse(new ByteArrayInputStream(xml))
        }
        return xmlNode
    }

}


