package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.sat.CuentaSat

@EqualsAndHashCode(includes='clave')
@ToString(includes='clave, tipo, subtipo, detalle',includeNames=true,includePackage=false)
class CuentaContable {

    String clave

    String descripcion

    String tipo

    CuentaContable padre

    Integer nivel

    String subTipo

    CuentaSat cuentaSat

    boolean detalle

    boolean deResultado

    String naturaleza

    boolean presentacionContable

    boolean presentacionFiscal

    boolean presentacionFinanciera

    boolean presentacionPresupuestal

    boolean suspendida

    Set<CuentaContable> subcuentas

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    static hasMany = [subcuentas:CuentaContable]

    static constraints = {
        clave nullable:true,maxSize:100 , unique:true
        descripcion blank:false,maxSize:300
        tipo inList:['ACTIVO','PASIVO','CAPITAL','ORDEN']
        subTipo inList: ['CIRCULANTE', 'FIJO', 'DIFERIDO', 'CORTO_PLAZO', 'LARGO_PLAZO', 'CAPITAL', 'ORDEN']
        naturaleza inList:['DEUDORA','ACREEDORA']
        cuentaSat nullable:true
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping ={
        subcuentas cascade: "all-delete-orphan", batchSize: 10

    }

    String toString(){
        return "${clave} ${descripcion}"
    }

    static CuentaContable buscarPorClave(String clave){
        def found=CuentaContable.findByClave(clave)
        if(!found)
            throw new RuntimeException("No existe la cuenta contable: $clave")
        return found
    }
}
