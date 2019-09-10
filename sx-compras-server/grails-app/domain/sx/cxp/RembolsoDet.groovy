package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.contabilidad.CuentaContable

@ToString( includes ='nombre, total, apagar, documentoSerie, documentoFolio, concepto, comentario', includeNames=true, includePackage=false)
@EqualsAndHashCode(includes = 'id, total, documentoSerie, documentoFolio')
@GrailsCompileStatic
class RembolsoDet {

    CuentaPorPagar cxp
    
    NotaDeCreditoCxP nota

    String nombre

    BigDecimal total = 0.0

    BigDecimal apagar = 0.0

    String documentoSerie

    String documentoFolio

    Date documentoFecha

    String comentario

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    String concepto

    CuentaContable cuentaContable

    String sucursal

    static belongsTo = [rembolso:Rembolso]

    static constraints = {
        cxp nullable: true
        nota nullable: true
        nombre nullable: true
        comentario nullable:true
        documentoFecha nullable:true
        documentoFolio nullable:true
        documentoSerie nullable:true
        concepto nullable: true
        createUser nullable: true
        updateUser nullable: true
        cuentaContable nullable: true
        sucursal nullable: true
    }

    static mapping ={
        documentoFecha type: 'date'

    }

}
