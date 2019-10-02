package sx.compras

import grails.gorm.transactions.Transactional

import sx.core.LogUser

@Transactional
class AnalisisDeDevolucionService implements LogUser {

    AnalisisDeDevolucion saveAnalisis(AnalisisDeDevolucion analisis) {
    	logEntity(analisis)
    	if(analisis.dec) {
    		def dec = analisis.dec
    		dec.costoDec = analisis.costo
    		if(dec.inventario) {
    			def inventario = dec.inventario
    			inventario.costo = analisis.costo
    			inventario.save flush: true
    		}
    		dec.save flush: true
    	}
    	analisis.save failOnError: true, flush: true
    	return analisis

    }
}
