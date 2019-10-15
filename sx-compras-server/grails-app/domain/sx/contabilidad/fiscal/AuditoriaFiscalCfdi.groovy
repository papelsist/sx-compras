package sx.contabilidad.fiscal

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@ToString(includeNames=true,includePackage=false, excludes = ['dateCreated', 'lastUpdated', 'ack'])
@EqualsAndHashCode(includeFields = true, includes = ['id'])
class AuditoriaFiscalCfdi {
    
    Integer ejercicio
    Integer mes
    Integer dia

    Date fecha
    String tipo
    String estatus
    
    Long registrosSx = 0
    Long registrosSat = 0
    Long registrosDiferencia = 0
    
    BigDecimal importeSx = 0.0
    BigDecimal importeSat = 0.0
    BigDecimal importeDiferencia = 0.0

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        createUser nullable: true
        updateUser nullable: true
        tipo size: 1..1
        estatus inList: ['VIGENTES','CANCELADOS']
    }

    static mapping = {
        ejercicio unique: ['mes', 'dia'], index: 'AUDITORIA_FISCAL_CFDI_IDX0'
        mes index: 'AUDITORIA_FISCAL_CFDI_IDX0'
        dia index: 'AUDITORIA_FISCAL_CFDI_IDX0'
        fecha type: 'date', index: 'AUDITORIA_FISCAL_CFDI_IDX1'
    }

}
