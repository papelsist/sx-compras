package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Cliente
import sx.cxc.Cobro

/**
 * DEVOUCION DE COBROS SOLO CON SALDO A FAVOR
 * 	AL SALVAR DEBE MANDAR A DIFERENCIA Y DIF FECHA
 * 	DE COBRO EL SAF Y SU FECHA DE OP.
 * 	CREAR EL EGRESO EN MOV DE CTA
 * REPORTE :	DEVOLUCION AL CLIENTE
 *
 * 		ID
 * 		FOLIO
 * 		FECHA
 * 		COBRO_ID	116228100
 * 		IMPORTE
 * 		CONCEPTO
 * 			DEPOSITO_DEVUELTO
 * 			DEPOSITO_POR_IDENTIFICAR
 * 			NOTA_CON
 * 			NOTA_COD
 * 			NOTA_CRE
 * 			SALDO_A_FAVOR
 * 		EGRESO_ID
 * 		COMENTARIO
 */
@EqualsAndHashCode(includes='id')
@ToString( excludes = "version, lastUpdated, dateCreated",includeNames=true,includePackage=false)
class DevolucionCliente {

    String formaDePago

    Date fecha

    Cliente cliente

    String afavor

    CuentaDeBanco cuenta

    Cobro cobro

    BigDecimal importe

    String concepto

    MovimientoDeCuenta egreso

    String comentario

    String referencia

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        egreso nullable: true
        createUser nullable: true
        updateUser nullable: true
        formaDePago inList: ['CHEQUE', 'TRANSFERENCIA']
        concepto inList: ['DEPOSITO_DEVUELTO',
                          'DEPOSITO_POR_IDENTIFICAR',
                          'NOTA_CON',
                          'NOTA_COD',
                          'NOTA_CRE',
                          'SALDO_A_FAVOR']

    }

    static mapping ={
        fecha type:'date'
    }

}



