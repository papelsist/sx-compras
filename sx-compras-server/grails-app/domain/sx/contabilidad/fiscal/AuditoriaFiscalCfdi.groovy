package sx.contabilidad.fiscal

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@ToString(includeNames=true,includePackage=false, excludes = ['dateCreated', 'lastUpdated'])
@EqualsAndHashCode(includeFields = true, includes = ['id'])
class AuditoriaFiscalCfdi {
    
    Integer ejercicio
    Integer mes
    
    String tipo
    String estatus
    
    Long registrosSx = 0
    Long registrosSat = 0
    Long diferencia
    

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        createUser nullable: true
        updateUser nullable: true
        tipo size: 1..1
        estatus inList: ['VIGENTE','CANCELADO']
    }

    static mapping = {
        ejercicio unique: ['mes', 'tipo', 'estatus'], index: 'AUDITORIA_FISCAL_CFDI_IDX0'
        mes index: 'AUDITORIA_FISCAL_CFDI_IDX0'
        diferencia formula: 'registros_sat - registros_sx'
    }

}
