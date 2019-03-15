package sx.logistica

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode

import sx.core.Cliente

@GrailsCompileStatic
@EqualsAndHashCode(includes=['id', 'documento'])
class Envio {

    String	id

    Embarque embarque

    Cliente cliente

    BigDecimal precioTonelada = 0.0

    String origen

    String entidad

    BigDecimal porCobrar

    Integer	paquetes

    BigDecimal kilos

    Boolean	parcial

    Date arribo

    Date recepcion

    String recibio

    String comentario

    String documento

    Date fechaDocumento

    BigDecimal totalDocumento

    String nombre

    String tipoDocumento

    BigDecimal arriboLatitud

    BigDecimal arriboLongitud

    BigDecimal recepcionLatitud

    BigDecimal recepcionLongitud

    String area

    String formaPago

    Boolean	entregado

    String	motivo

    Boolean	completo

    Boolean	matratado

    Boolean	impreso

    Boolean	cortado

    String reportoNombre

    String reportoPuesto

    BigDecimal valor

    List<EnvioDet> partidas = []

    BigDecimal maniobra

    Date dateCreated

    Date lastUpdated

    static  hasMany= [partidas : EnvioDet]

    static belongsTo = [embarque: Embarque]

    static mapping ={
        id generator:'uuid'
        partidas cascade: 'all-delete-orphan'
    }

    static constraints = {
        area nullable:true //inList:['COMPRAS','ALMACEN','MERCANCIAS','ENCARGADO','DUEÑO','OTRA']
        formaPago nullable:true
        motivo nullable: true //inList: ['CERRADO','SALIO_A_COMER','NO_PAGO','DIRECCION_INCORRECTA','ERROR EN MOSTRADOR']
        reportoPuesto nullable: true //inList: ['ENCARGADO_EMBARQUES','ENCARGADO_SUCURSAL','MOSTRADOR',]
        reportoNombre nullable: true
        arribo nullable: true
        recepcion nullable: true
        recibio nullable: true
        comentario nullable: true
        cliente nullable: true
        precioTonelada nullable: true
        maniobra nullable: true
    }

    def beforeDelete() {
        if( entidad == 'VENTA') {
            CondicionDeEnvio.withNewSession {
                CondicionDeEnvio envio = CondicionDeEnvio.where{venta.id == origen}.find()
                if(envio) {
                    envio.asignado = null;
                    envio.save flush: true
                }
            }
        }
    }

    def beforeUpdate() {
        /*
       if(!partidas) {
           this.acualizarValorDeOrigen()
       } else {
       }
       */
    }

    def acualizarValorDeOrigen() {
        /*
        if (entidad == 'VENTA') {
            Venta venta = Venta.get(envio.origen)
            this.valor = venta.subtotal
        }
        */
    }

}
