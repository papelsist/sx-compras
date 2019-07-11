package sx.contabilidad


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='ejercicio,mes, concepto')
@ToString(includes='ejercicio,mes,concepto',includeNames=true,includePackage=false)
class PagoIsr{

    Integer ejercicio
    Integer renglon
    String concepto
    String clave
    BigDecimal enero = 0.0
    BigDecimal febrero = 0.0
    BigDecimal marzo = 0.0
    BigDecimal abril = 0.0
    BigDecimal mayo = 0.0
    BigDecimal junio = 0.0
    BigDecimal julio = 0.0
    BigDecimal agosto = 0.0
    BigDecimal septiembre = 0.0
    BigDecimal octubre = 0.0
    BigDecimal noviembre = 0.0
    BigDecimal diciembre = 0.0

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        ejercicio inList: (2014..2030)
        concepto maxSize: 100
        
        updateUser nullable: true
        createUser nullable: true
    }

    /*
    Integer mes

    String concepto

    CuentaContable cuenta

    String clave

    BigDecimal importe

    Integer orden

    


    static constraints = {
        ejercicio inList: (2014..2030)
        mes inList: (1..12)
        concepto maxSize: 100
        cuenta nullable: true
        clave nullable: true
        descripcion nullable: true
        updateUser nullable: true
        createUser nullable: true
    }

    static mapping = {

    }
    */
}


