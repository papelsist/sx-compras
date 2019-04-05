package sx.logistica

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxc.CuentaPorCobrar


@GrailsCompileStatic
@ToString(includes='fuente, tasa fecha', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = ['nombre', 'tipo'])
class FacturistaOtroCargo {

    FacturistaDeEmbarque facturista

    Date fecha

    CuentaPorCobrar cxc

    String nombre

    BigDecimal importe

    String comentario

    String tipo

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser



    static constraints = {
        tipo inList: ['MATERIAL', 'CELULAR', 'PATIN', 'MANIOBRA_LOCAL', 'MANIOBRA_FORANEA', 'VALES', 'OTROS']
        createUser nullable: true
        updateUser nullable: true
    }

    static  mapping = {
        fecha type: 'date'
    }

}

