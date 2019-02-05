package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode

// @Resource(uri='/api/sat/cuentas', formats=['json'])
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='codigo')
class CuentaSat {

    String id
	
	String codigo

    String nombre

    String tipo

    Integer nivel

    static constraints = {
        codigo nullable:false,unique:true,maxSize:50
        tipo maxSize:100,nullable:true
    }

    String toString(){
        return "$codigo $nombre"
    }

    static  mapping={
        id generator:'uuid'
    }
}