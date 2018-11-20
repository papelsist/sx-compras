package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import sx.sat.CuentaSat

@EqualsAndHashCode(includes='clave')
class CuentaContable {

    String id

    String clave

    String descripcion

    String tipo

    CuentaContable padre

    CuentaSat cuentaSat

    boolean detalle

    boolean deResultado

    String naturaleza

    boolean presentacionContable

    boolean presentacionFiscal

    boolean presentacionFinanciera

    boolean presentacionPresupuestal

    boolean suspendida

    Set<CuentaSat> subcuentas

    Date dateCreated

    Date lastUpdated

    static hasMany = [subcuentas:CuentaContable]

    static constraints = {
        clave nullable:true,maxSize:100 , unique:true
        descripcion blank:false,maxSize:300
        tipo inList:['ACTIVO','PASIVO','CAPITAL','ORDEN', 'OTRA']
        naturaleza inList:['DEUDORA','ACREEDORA', 'MIXTA', 'OTRA']
        cuentaSat nullable:true
    }

    static mapping ={
        id generator:'uuid'
        subcuentas cascade: "all-delete-orphan", batchSize: 10

    }

    String toString(){
        return clave+" "+descripcion
    }

    static CuentaContable buscarPorClave(String clave){
        def found=CuentaContable.findByClave(clave)
        if(!found)
            throw new RuntimeException("No existe la cuenta contable: $clave")
        return found
    }
}
