package sx.compras

import grails.gorm.transactions.Transactional

import sx.core.LogUser

@Transactional
class AnalisisDeDevolucionService implements LogUser {

    AnalisisDeDevolucion saveAnalisis(AnalisisDeDevolucion analisis) {
    	logEntity(analisis)
    	analisis.save failOnError: true, flush: true
    	return analisis

    }
}
