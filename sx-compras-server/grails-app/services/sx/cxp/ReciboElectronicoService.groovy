package sx.cxp

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser



// @Transactional
// @GrailsCompileStatic
@Slf4j
class ReciboElectronicoService implements LogUser {

	static String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"


    ReciboElectronico save(ReciboElectronico recibo) {
    	logEntity(recibo)
    	recibo.save failOnError: true, flush: true
    	return recibo
    }

    def buscarPendientes() {
    	def pendientes = ComprobanteFiscal.findAll("""
    		from ComprobanteFiscal c 
    		where c.tipoDeComprobante = 'P'
    		  and year(c.fecha) > 2018	
    		  and c.id not in(select x.cfdi.id from ReciboElectronico x )
    		""")
    	return pendientes
    }

    def procesarCfdisPendientes() {
    	def pendientes = buscarPendientes()
    	pendientes.each { cfdi ->
    		def recibos = buildRecibos(cfdi)
    		recibos.each { r ->
    			asignarFacturas(r)
    		}
    	}
    }

    


    List<ReciboElectronico> buildRecibos(ComprobanteFiscal cfdiSource) {
    	if(cfdiSource.tipoDeComprobante != 'P') {
    		return null
    	}
    	List<ReciboElectronico> recibos = ReciboElectronico.where{cfdi == cfdiSource}.list()
    	if(recibos) {
    		log.info('Recibos electronico ya generados ')
    		return recibos
    	}
    	recibos = buildFrom(cfdiSource)
    	List res = []
    	recibos.each { recibo ->
    		res.add(save(recibo))
    	}

    	return res
    }

    @Transactional
    def buildFrom(ComprobanteFiscal cfdi) {
    	log.info('Generando ReciboElectronico con CFDI: {}', cfdi.id)
    	def xml = cfdi.getXmlNode()
    	def pagosNode = xml.breadthFirst().find { it.name() == 'Pagos'}
    	List<ReciboElectronico> recibos = []

    	def conceptos = xml.Complemento.Pagos
    	conceptos.childNodes().each{
        	Map map = it.attributes()
        	log.info('Armando recibo con node: {} Attrs: {}', it.name(), map)
        	ReciboElectronico recibo = new ReciboElectronico()
    		recibo.cfdi = cfdi
    		recibo.with {
	    		fecha = cfdi.fecha
				serie = cfdi.serie
	    		folio = cfdi.folio
	    		emisor = cfdi.emisorNombre
	    		emisorRfc = cfdi.emisorRfc
	    		receptor = cfdi.receptorNombre
	    		receptorRfc = cfdi. receptorRfc
	    		uuid = cfdi.uuid
	    		numOperacion = map['NumOperacion']
    			formaDePagoP = map['FormaDePagoP']
    			monto = new BigDecimal(map['Monto'])
    			fechaPago = Date.parse(DATE_FORMAT, map['FechaPago'])
    			monedaP = map['MonedaP']
    		}
        	def nn = it.childNodes().each { l ->
        		ReciboElectronicoDet det = new ReciboElectronicoDet()
        		Map data = l.attributes()
        		det.with {
        			folio = data['Folio']
					serie = data['Serie']
					idDocumento = data['IdDocumento']
					numParcialidad = (data['NumParcialidad'] as Integer) ?: 0.0
					monedaDR = data['MonedaDR'] ?: 'MXN'
					metodoDePagoDR = data['MetodoDePagoDR']
					impPagado = (data['ImpPagado'] as BigDecimal) ?: 0.0
					impSaldoInsoluto = (data['ImpSaldoInsoluto'] as BigDecimal) ?: 0.0
					impSaldoAnt = (data['ImpSaldoAnt'] as BigDecimal) ?: 0.0
        		}
            	log.info("D: {}", l.attributes())
            	recibo.addToPartidas(det)
        	}
        	recibos.add(recibo)
        	// recibo.save failOnError: true, flush: true
    	}
    	return recibos
    }

    @Transactional
    def asignarFacturas(ReciboElectronico recibo) {
    	recibo.partidas.each { r ->
    		if(!r.cxp) {
				def cxp = CuentaPorPagar.where{uuid == r.idDocumento}.find()
				if(!cxp) 
					log.info('No existe factura : {}', r.idDocumento)
				else 
					log.info('Factura encontrada: {}', cxp.id)
				r.cxp = cxp
				r.save flush: true
    		}
    		
    	}
    }

    def buscarRequisicionesPendientes() {
    	def pendientes = RequisicionDeCompras.findAll("""
    		from RequisicionDeCompras r 
    		where r.recibo = null 
              and r.egreso != null
              and year(r.egreso.fecha) > 2018
            order by r.fecha asc
    		""")
    	return pendientes
    }

    def vincularRequisicionesPendientes() {
    	def pendientes = buscarRequisicionesPendientes()
    	pendientes.each { req ->
    		def im = req.egreso.importe.abs()
    		log.info("Requisicion: {} Egreso: ${im}", req.folio, im)
    		def recibo = ReciboElectronico.where{emisorRfc == req.proveedor.rfc && monto == im}.find()
    		if(recibo) {
        		req.recibo = recibo
        		req.save flush: true
        		recibo.requisicion = req.id
        		recibo.save flush: true
    		}
		}
    }


}
