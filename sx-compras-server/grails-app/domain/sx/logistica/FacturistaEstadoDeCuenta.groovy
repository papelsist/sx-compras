package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@GrailsCompileStatic
@EqualsAndHashCode(includes='id, envio')
@ToString(excludes = 'version, dateCreated,lastUpdated, partidas', includeNames=true, includePackage=false)
class FacturistaEstadoDeCuenta {

    FacturistaDeEmbarque facturista

    String nombre

    Date fecha

    String tipo

    String origen

    String concepto

    BigDecimal importe

    BigDecimal saldo

    BigDecimal tasaDeInteres = 0.0

    String comentario

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated

    static constraints = {
        tipo inList: ['PRESTAMO_PERSONAL', 'OTROS_CARGOS', 'ABONO', 'INTERESES', 'INTERESES_IVA']
        origen nullable: true
        comentario nullable: true
        tasaDeInteres nullable: true
    }


    static  mapping = {
        fecha type: 'date'
    }


}




