package sx.compras

import grails.compiler.GrailsCompileStatic

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

import sx.core.Sucursal
import sx.core.Proveedor



@ToString(excludes = 'dateCreated,lastUpdated, partidas',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id,sucursal,folio')
@GrailsCompileStatic
class Compra {


    String id

    Proveedor proveedor

    String nombre

    String rfc

    String clave

    Sucursal sucursal

    Long folio

    String serie

    Date fecha

    Date cerrada

    Date entrega

    String comentario

    Date ultimaDepuracion

    BigDecimal importeBruto = 0.0

    BigDecimal importeNeto = 0.0

    BigDecimal importeDescuento = 0.0

    BigDecimal impuestos = 0.0

    BigDecimal total = 0.0

    String moneda = 'MXN'

    BigDecimal tipoDeCambio = 1.0

    Boolean pendiente = true

    Boolean consolidada = false

    Boolean centralizada = false

    Boolean especial= false

    Boolean nacional = true

    List<CompraDet> partidas  = []

    String sw2

    Date dateCreated

    Date lastUpdated

    String createdBy

    String lastUpdatedBy

    String status


    static constraints = {
        comentario nullable:true
        nombre nullable:true
        clave nullable:true, maxSize: 15
        rfc nullable:true, maxSize: 14
        entrega nullable:true
        serie nullable: true
        folio unique:['sucursal']
        sw2 nullable:true
        createdBy nullable: true
        lastUpdatedBy nullable: true
        ultimaDepuracion nullable:true
        cerrada nullable: true

    }

    static hasMany =[partidas:CompraDet]

    static transients = ['status']

    static mapping = {
        id generator:'uuid'
        partidas cascade: "all-delete-orphan"
        fecha type:'date', index: 'COMPRA_IDX1'
        entrega type:'date'
        folio index: 'COMPRA_IDX2'
        cerrada type: 'date'
    }

    /*
    def beforeUpdate() {
        actualizarStatus()
    }



    def pendientes() {
        return this.partidas.findAll{ CompraDet det -> det.getPorRecibir() > 0}
    }
    */

    def getStatus() {
        if(!pendiente)
            return 'A'
        else if(pendiente && cerrada )
            return 'T'
        else
            return 'P'
    }

}

