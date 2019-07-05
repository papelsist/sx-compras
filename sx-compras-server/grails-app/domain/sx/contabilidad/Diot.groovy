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

    BigDecimal pagos1516 = 0.00

    BigDecimal pagos15 = 0.00

    BigDecimal ivaPagado1516 = 0.00

    BigDecimal pagos1011 = 0.00

    BigDecimal pagos10 = 0.00

    BigDecimal pagosFrontera = 0.00

    BigDecimal ivaPagado1011 = 0.00

    BigDecimal ivaPagadoFrontera = 0.00

    BigDecimal pagosImportacion = 0.00

    BigDecimal ivaPagadoImportacion1516 = 0.00

    BigDecimal pagosImportacion1011 = 0.00

    BigDecimal ivaPagadoImportacion1011 = 0.00

    BigDecimal pagosImportacionSinIva = 0.00

    BigDecimal pagosTasa0 = 0.00

    BigDecimal pagosSinIva = 0.00

    BigDecimal ivaRetenidoContribuyente = 0.00

    BigDecimal ivaNotas = 0.00 


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


