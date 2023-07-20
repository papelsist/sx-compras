package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.utils.Periodo


@GrailsCompileStatic
@EqualsAndHashCode(includes='id,ejercicio, mes')
@ToString(includeNames = true, includePackage = false)
class SatMetadataProveedor {

    Integer ejercicio
    Integer mes
    String uuid
    String emisorRfc 
    String emisorNombre
    String receptorRfc
    String recepctorNombre
    String pacRfc
    Date fechaEmision
    Date fechaCertificacionSat
    BigDecimal monto
    String efectoComprobante
    String estatus
    Date fechaCancelacion
    String aclaracion
    String origen
    BigDecimal subtotal = 0.00
    BigDecimal iva = 0.00
    BigDecimal ivaRetenido = 0.00
    BigDecimal isrRetenido = 0.00
    BigDecimal total = 0.00
    BigDecimal tc = 0.00
    String moneda
    String formaDePago
    String referencia
    Date  fechaPago

    static String DF = 'yyyy-MM-dd HH:mm:ss'


    static constraints = {
        uuid maxSize: 70
        emisorRfc maxSize: 15
        receptorRfc maxSize: 15
        pacRfc maxSize: 15
        estatus maxSize: 5
        fechaCancelacion nullable: true
        aclaracion nullable: true
        origen nullable: true
        subtotal nullable: true
        iva nullable: true
        ivaRetenido nullable: true
        isrRetenido nullable: true
        total nullable: true
        tc nullable: true
        moneda nullable: true
        formaDePago nullable: true
        referencia nullable: true
        fechaPago nullable: true

    }

    static mapping = {
        uuid index: 'SATMETADATA_IDX0'
        fechaEmision index: 'SATMETADATA_IDX1'
        ejercicio index: 'SATMETADATA_IDX2'
        mes index: 'SATMETADATA_IDX2'
        estatus index: 'SATMETADATA_IDX5'
        fechaCancelacion index: 'SATMETADATA_IDX6'
        emisorRfc index: 'SATMETADATA_RFC_01'
        emisorNombre index: 'SATMETADATA_RFC_01'
        receptorRfc index: 'SATMETADATA_RFC_02'
        recepctorNombre index: 'SATMETADATA_RFC_02'
    }

    SatMetadataProveedor() {}

    SatMetadataProveedor(String line) {
        def split = line.split('~')
        def size = split.size()
        def data = [
            uuid: split[0], 
            emisorRfc: split[1], 
            emisorNombre: split[2],
            receptorRfc: split[3],
            pacRfc: split[5],
            fechaEmision: Date.parse(DF, split[6]),
            fechaCertificacionSat: Date.parse(DF, split[7]),
            monto: new BigDecimal(split[8]),
            efectoComprobante: split[9],
            estatus: split[10]
            ]
        if(size == 12) {
            fechaCancelacion = Date.parse(DF, split[11]) 
        }
        this.properties = data
        this.recepctorNombre = split[4]?: 'PAPEL SA DE CV'
        this.ejercicio = Periodo.obtenerYear(fechaEmision)
        this.mes = Periodo.obtenerMes(this.fechaEmision) + 1
    }

    

}
