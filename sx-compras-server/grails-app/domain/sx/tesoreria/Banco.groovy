package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.sat.BancoSat

@ToString(includes = ['id', 'nombre'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'nombre'])
class Banco {

	String id

	String nombre

	BancoSat bancoSat

    Boolean nacional = true

    Long sw2

    static constraints = {
    	nombre unique: true
    	bancoSat nullable: true
        sw2 nullable: true
        nacional nullable:true
    }
    

    String toString(){
        return nombre
    }

    static mapping={
        id generator:'uuid'
    }
}
