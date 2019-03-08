package sx.cxp

import grails.events.annotation.Publisher
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityService
import groovy.util.logging.Slf4j

import sx.core.Folio
import sx.utils.MonedaUtils

@Slf4j
@Transactional
class AnalisisDeFacturaService {

    SpringSecurityService springSecurityService

    AnalisisDeFactura save(AnalisisDeFactura analisis) {
        // Actualizar el status de a cuenta por pagar
        logEntity(analisis)
        log.debug("Salvando analisis de factura  {}", analisis)
        CuentaPorPagar cxp = analisis.factura
        cxp.analizada = true
        cxp.updateUser = analisis.updateUser
        cxp.save flush: true

        actualizarFlete(analisis)
        analisis.folio = nextFolio()
        analisis.fechaEntrada = analisis.fecha
        analisis.save failOnError: true, flush: true
        return analisis
    }

    @Publisher('analisisActualizado')
    AnalisisDeFactura update(AnalisisDeFactura analisis) {
        log.info('UPDATE: {}', analisis.id)
        analisis.partidas.each { AnalisisDeFacturaDet it ->
            it.clave = it.com.producto.clave
            it.descripcion = it.com.producto.descripcion
            it.costoUnitario = MonedaUtils.aplicarDescuentosEnCascada(it.precioDeLista, it.desc1, it.desc2, it.desc3, it.desc4)
            // log.debug("{} Precio de lista: {} Costo unitario: {}",it.clave, it.precioDeLista,it.costoUnitario)
            // Actualizacion de importes
            BigDecimal cantidad = it.com.producto.unidad == 'MIL' ? it.cantidad/1000 : it.cantidad;
            BigDecimal importeBruto = it.precioDeLista * cantidad
            importeBruto = MonedaUtils.aplicarDescuentosEnCascada(importeBruto, it.desc1, it.desc2, it.desc3, it.desc4)
            it.importe = importeBruto
            analisis.fechaEntrada = it.com.recepcion.fecha

        }
        BigDecimal importe = analisis.partidas.sum 0.0, { it.importe }
        analisis.importe = importe
        actualizarFlete(analisis)
        logEntity(analisis)
        analisis.save flush: true
        return analisis
    }

    @Publisher('analisisEliminado')
    List<String> delete(AnalisisDeFactura analisis) {
        log.info('DELETE Analisis: {}', analisis.folio)
        List<String> coms = analisis.partidas.collect{it.com.id}
        analisis.factura.analizada=false
        analisis.factura.save failOnError: true,flush: true
        analisis.delete flush: true
        return coms
    }

    AnalisisDeFactura cerrar(AnalisisDeFactura analisis) {
        log.debug("CERRANDO analisis de factura  {}", analisis)
        logEntity(analisis)

        CuentaPorPagar cxp = analisis.factura
        cxp.analizada = true
        BigDecimal importe = analisis.partidas.sum 0.0, { it.importe }
        analisis.importe = importe
        calcularImporteAPagar(analisis, cxp)
        cxp.updateUser = analisis.updateUser
        cxp.save flush: true

        analisis.cerrado = new Date()
        analisis.save flush: true
        return analisis
    }

    void calcularImporteAPagar(AnalisisDeFactura analisis, CuentaPorPagar cxp) {
        BigDecimal importeAnalizado = analisis.importe
        BigDecimal impuestoAnalizado = MonedaUtils.calcularImpuesto(importeAnalizado)
        impuestoAnalizado = MonedaUtils.round(impuestoAnalizado)
        BigDecimal apagar = importeAnalizado + impuestoAnalizado + analisis.importeFlete + analisis.impuestoFlete - analisis.retencionFlete
        cxp.importePorPagar = apagar
    }

    private actualizarFlete(AnalisisDeFactura analisis)  {
        if(analisis.importeFlete > 0 ){
            analisis.impuestoFlete = MonedaUtils.calcularImpuesto(analisis.importeFlete)
            analisis.retencionFlete = MonedaUtils.calcularImpuesto(analisis.importeFlete, 0.04)
        }
    }

    private logEntity(AnalisisDeFactura analisis ){
        def user = springSecurityService.getCurrentUser()
        if(user) {
            String username = user.username
            if(analisis.id == null)
                analisis.createUser = username
            analisis.updateUser = username
        }
    }


    Long  nextFolio(){
        Folio folio = Folio.findOrCreateWhere(entidad: 'ANALISIS', serie: 'CXP')
        Long res = folio.folio + 1
        log.info('Asignando folio: {}', res)
        folio.folio = res
        folio.save flush: true
        return res
    }



}
