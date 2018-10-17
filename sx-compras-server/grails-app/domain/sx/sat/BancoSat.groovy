package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode


@Resource(readOnly = false, formats = ['json'], uri = "/api/sat/bancos")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='clave')
class BancoSat {

    String id

    String clave

    String nombreCorto

    String razonSocial

    static constraints = {
        clave nullable:false,unique:true,maxSize:20
        razonSocial nullable: true
    }

    String toString(){
        return "$clave $nombreCorto"
    }

    static  mapping={
        id generator:'uuid'
    }
}
