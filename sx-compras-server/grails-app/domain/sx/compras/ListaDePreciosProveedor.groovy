package sx.compras

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Proveedor

@ToString(includeNames=true,includePackage=false, excludes = ['lastUpdated', 'dateCreated','id','version','partidas'])
@EqualsAndHashCode(includeFields = true,includes = ['id'])
@GrailsCompileStatic
class ListaDePreciosProveedor {

    Proveedor proveedor

    Integer ejercicio

    Integer mes

    Date fechaInicial

    Date fechaFinal

    String descripcion

    String moneda = 'MXN'

    List<ListaDePreciosProveedorDet> partidas

    Date aplicada

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    Long sw2

    Long copia

    static constraints = {
        descripcion nullable:true
        createUser nullable: true
        updateUser nullbale: true
        moneda maxSize: 5
        sw2 nullable: true
        copia nullable: true
        aplicada nullable: true
    }

    static hasMany =[partidas:ListaDePreciosProveedorDet]

    static mapping = {
        partidas cascade: "all-delete-orphan"
        fechaInicial type:'date'
        fechaFinal type:'date'
        aplicada type: 'date'
    }


}
