package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@ToString(includes ='emisorRfc, serie, folio, fileName',includeNames=true,includePackage=false)
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

    //Importes
    BigDecimal subTotal = 0.0
    BigDecimal descuento = 0.0
    BigDecimal impuestoTrasladado
    BigDecimal impuestoRetenido
    BigDecimal total = 0.0

    String comentario

    byte[] pdf
    byte[] acuse


    Date dateCreated
    Date lastUpdated

    static constraints = {
        serie nullable:true,maxSize:30
        folio nullable:true,maxSize:30
        emisorNombre nullable: true
        emisorRfc minSize: 12, maxSize:13
        receptorNombre nullable: true
        receptorRfc minSize: 12, maxSize:13
        tipoDeComprobante inList: ['I','E','T', 'P']
        uuid maxSize:40,unique:true
        formaDePago nullable: true, maxSize:5
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

    }

    static  mapping = {
        id generator:'uuid'
        fecha index: 'CF_IDX1'
        uuid index: 'CF_IDX2'
        emisorRfc index: 'CF_IDX_3'
    }

}


