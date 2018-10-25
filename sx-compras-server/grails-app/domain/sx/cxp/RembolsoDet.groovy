package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(excludes ='id,version,dateCreated,lastUpdated,rembolso',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, total, cxp, documentoSerie, documentoFolio')
@GrailsCompileStatic
class RembolsoDet {

    CuentaPorPagar cxp

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

    static belongsTo = [rembolso:Rembolso]

    static constraints = {
        cxp nullable: true
        nombre nullable: true
        comentario nullable:true
        documentoFecha nullable:true
        documentoFolio nullable:true
        documentoSerie nullable:true
        concepto nullable: true
    }

}
