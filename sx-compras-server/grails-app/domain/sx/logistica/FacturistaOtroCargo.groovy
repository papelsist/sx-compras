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

    CuentaPorCobrar cxc

    String nombre

    BigDecimal importe

    BigDecimal saldo

    String comentario

    String tipo

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser



    static constraints = {
        tipo inList: ['MATERIAL', 'CELULAR', 'OTROS']
    }

}

