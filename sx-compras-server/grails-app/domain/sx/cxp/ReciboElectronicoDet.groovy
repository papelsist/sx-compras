package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includes = 'id', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id, idDocumento')
class ReciboElectronicoDet {

	ReciboElectronico recibo
	
	String folio
	String serie
	String idDocumento

	Integer numParcialidad
	String monedaDR

	String metodoDePagoDR

	BigDecimal impPagado
	BigDecimal impSaldoInsoluto
	BigDecimal impSaldoAnt

	CuentaPorPagar cxp

	String validacionFactura



    static constraints = {
    	cxp nullable: true
    	serie nullable: true
    	folio nullable: true
    	monedaDR nullable: true
    	validacionFactura nullable: true
    }

    static  mapping = {
        uuid idDocumento: 'REDET_IDX1'
    }

    static belongsTo = [recibo: ReciboElectronico]
}
