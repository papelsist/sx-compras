package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.sat.BancoSat

@ToString(includes = ['id', 'clave', 'descripcion', 'numero'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'clave', 'numero'])
class CuentaDeBanco {

    String id

    BancoSat bancoSat

    String numero

    String clave

    String descripcion

    String tipo

    Currency moneda

    Boolean activo = true

    Boolean disponibleEnVenta = false

    Boolean disponibleEnPagos = false

    String subCuentaOperativa

    String impresionTemplate

    Long sw2

    Date dateCreated

    Date lastUpdated

    String createUser
    String updateUser

    Long proximoCheque

    static constraints = {
    	numero maxSize:30
        clave maxSize:30, unique: true
        descripcion minSize:3
        tipo inList:['CHEQUES','INVERSION']
        impresionTemplate nullable:true, maxSize:50
        subCuentaOperativa nullable:true, maxSize:4
        sw2 nullable:true
        bancoSat nullable: true
        disponibleEnPagos nullable: true
        disponibleEnVenta nullable: true
        createUser nullable: true
        updateUser nullable: true
        proximoCheque nullable: true
    }

    String toString() {
        return "$numero $descripcion"
    }

    static mapping={
        id generator:'uuid'
    }


}
