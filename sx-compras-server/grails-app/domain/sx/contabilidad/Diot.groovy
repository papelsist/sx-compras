package sx.contabilidad


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='ejercicio,mes')
@ToString(includes='ejercicio,mes, proveedor, rfc',includeNames=true,includePackage=false)
class Diot{

    Integer ejercicio

    Integer mes

    String proveedor

    String tipoTercero

    String tipoOperacion

    String rfc

    String idFiscal

    String nombreExtranjero

    String paisResidencia

    String nacionalidad

    Integer pagos1516 = 0

    Integer pagos15 = 0

    Integer ivaPagado1516 = 0

    Integer pagos1011 = 0

    Integer pagos10 = 0

    Integer pagosFrontera = 0

    Integer ivaPagado1011 = 0

    Integer ivaPagadoFrontera = 0

    Integer pagosImportacion = 0

    Integer ivaPagadoImportacion1516 = 0

    Integer pagosImportacion1011 = 0

    Integer ivaPagadoImportacion1011 = 0

    Integer pagosImportacionSinIva = 0

    Integer pagosTasa0 = 0

    Integer pagosSinIva = 0

    Integer ivaRetenidoContribuyente = 0

    Integer ivaNotas = 0 

    Integer ivaAcreditable = 0

    Integer ivaAnticipo = 0




    static constraints = {
        ejercicio inList:(2014..2030)
        mes inList:(1..12)
        tipoTercero nullable: true
        tipoOperacion nullable: true
        rfc nullable: true
        idFiscal nullable: true
        nombreExtranjero nullable: true
        paisResidencia nullable: true
        nacionalidad nullable:  true
    }

    static mapping = {

    }
}


