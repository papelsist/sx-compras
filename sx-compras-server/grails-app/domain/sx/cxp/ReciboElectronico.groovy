package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.util.slurpersupport.GPathResult


@ToString(includes ='emisorRfc, receptorRfc, serie, folio', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id, uuid')
class ReciboElectronico {

	Date fecha

	String serie

    String folio

    String emisor
    String emisorRfc

    String receptor
    String receptorRfc

    ComprobanteFiscal cfdi

    String uuid

    String validacionFacturas
    String validacionPago

    String numOperacion 
    String formaDePagoP
    BigDecimal monto
    Date fechaPago
    String monedaP

    Set<ReciboElectronicoDet> partidas

    String requisicion

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated

    Date revision

    static constraints = {
    	numOperacion maxSize: 100, nullable: true
    	formaDePagoP maxSize: 5
    	monedaP maxSize: 5
    	folio nullable: true
    	serie nullable: true
    	createUser nullable: true
    	updateUser nullable: true
    	validacionPago nullable: true
    	validacionFacturas nullable: true
    	requisicion nullable: true
        revision nullable: true
    }

    static  mapping = {
        fecha type: 'date', index: 'RE_IDX1'
        uuid index: 'RE_IDX2'
        emisorRfc index: 'RE_IDX_3'
        partidas cascade: "all-delete-orphan"
    }

    static hasMany =[partidas: ReciboElectronicoDet]
}
