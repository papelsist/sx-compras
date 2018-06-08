package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@ToString(excludes ='id,version,dateCreated,lastUpdated, xml, pdf',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, uuid')
class ComprobanteFiscal {

    String id

    byte[] xml
    String fileName
    String serie
    String folio
    Date fecha

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
    BigDecimal total

    String comentario

    Boolean analizado = false

    byte[] pdf
    byte[] acuse


    Date dateCreated
    Date lastUpdated

    static constraints = {

        xml maxSize:(1024 * 512)  // 50kb para almacenar el xml
        fileName nullable: true
        serie nullable:true,maxSize:30
        folio nullable:true,maxSize:30
        emisorNombre nullable: true
        emisorRfc minSize: 12, maxSize:13
        receptorNombre nullable: true
        receptorRfc minSize: 12, maxSize:13
        tipoDeComprobante inList: ['I','E','T']
        uuid maxSize:40,unique:true
        fileName maxSize:30
        formaDePago maxSize:5
        metodoDePago maxSize:5
        moneda maxSize: 5
        tipoDeCambio scale: 6
        pdf nullable: true , maxSize:(1024 * 512 * 10)
        acuse nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        comentario nullable: true
        usoCfdi maxSize: 10, nullable: true

    }

    static  mapping={
        id generator:'uuid'
        fecha index: 'CF_IDX1'
        uuid index: 'CF_IDX2'
        emisorRfc index: 'CF_IDX_3'
    }

}


