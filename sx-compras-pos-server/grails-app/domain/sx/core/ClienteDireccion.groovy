package sx.core

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='nombre')
@ToString(includeNames=true,includePackage=false)
class ClienteDireccion {

    String id
    String nombre
    Direccion direccion

    static constraints = {
    }

    static embedded = ['direccion']

    // static belongsTo = [cliente: Cliente]

    static mapping= {
        id generator: 'uuid'
    }
}
