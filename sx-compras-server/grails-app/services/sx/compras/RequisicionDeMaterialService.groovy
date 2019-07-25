package sx.compras

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.core.FolioLog
import sx.core.Proveedor
import sx.core.Producto
import sx.core.Sucursal


@Transactional
@GrailsCompileStatic
@Slf4j
class RequisicionDeMaterialService implements LogUser, FolioLog {

    CompraService compraService

    RequisicionDeMaterial save(RequisicionDeMaterial requisicion) {
    	// log.debug("Salvando requisicion de material {}", requisicion)
        if(!requisicion.id )
            requisicion.folio = nextFolio('REQUISICION_MATERIAL', 'REQUISICION')
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion

    }

    RequisicionDeMaterial update(RequisicionDeMaterial requisicion) {
    	// log.debug("Actualizando requisicion de material {}", requisicion)
        requisicion.partidas.each {
        	it.sucursal = requisicion.sucursal
        	logEntity(it)
        }
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion

    }

    RequisicionDeMaterial generarCompra(RequisicionDeMaterial req) {
        log.info('Generando O. de compra con req: {}', req)
        if(req.compra){
            throw new RuntimeException("YA SE GENERO O. DE COMPRA DE LA REQUISICIÓN  ${req.folio} (${req.sucursal}) ")
        }
        Sucursal suc = Sucursal.where{nombre == req.sucursal}.find()
        Proveedor prov = Proveedor.where{clave == req.clave}.find()
        Compra compra = new Compra()
        compra.fecha = new Date()
        compra.folio = -1L
        compra.sucursal = suc
        compra.proveedor = prov
        req.partidas.each { item ->
            CompraDet det = new CompraDet()
            Producto p = Producto.where{clave == item.producto}.find()
            det.sucursal = suc
            det.producto = p
            det.clave = p.clave
            det.descripcion = p.descripcion
            det.unidad = p.unidad
            det.solicitado = item.solicitado
            det.comentario =  item.comentario
            compra.addToPartidas(det)
        }
        compra.comentario = "GENERADA POR REQUISICION ${req.folio}"
        compraService.actualizarPreciosVigentes(compra)
        compra = compraService.saveCompra(compra)
        // compra = compraService.actualizarPreciosVigentes(compra)
        log.info('Compra generada {}', compra.id)
        req.compra = compra.id
        logEntity(req)
        req.save failOnError: true, flush: true
        return req

    }
}
