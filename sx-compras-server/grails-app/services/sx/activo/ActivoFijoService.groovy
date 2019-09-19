package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.utils.Periodo
import sx.cxp.GastoDet

@Transactional
// @GrailsCompileStatic
@Slf4j
class ActivoFijoService implements LogUser {

    ActivoDepreciacionFiscalService activoDepreciacionFiscalService
    ActivoDepreciacionService activoDepreciacionService
    

    ActivoFijo save(ActivoFijo activo) {
    	log.debug("Salvando activo de material {}", activo)
        logEntity(activo)
        activo.save failOnError: true, flush: true
        return activo

    }

    ActivoFijo update(ActivoFijo activo) {
    	log.debug("Actualizando activo de material {}", activo)
        logEntity(activo)
        activo.save failOnError: true, flush: true
        return activo

    }

    ActivoFijo registrarBaja(ActivoFijo activo) {
        log.info('Baja de activo: {}', activo.baja)
        activoDepreciacionService.registrarBajaContable(activo)
        activoDepreciacionFiscalService.registrarBajaFiscal(activo)
        activo.estado = 'VENDIDO'
        logEntity(activo)
        activo.save failOnError: true, flush: true
        return activo
    }

    ActivoFijo cancelarBaja(ActivoFijo activo) {
        def baja = activo.baja
        activo.baja = null
        activo.estado = baja.remanenteContable > 0 ? 'VIGENTE' : 'DEPRECIADO'
        logEntity(activo)

        baja.delete flush: true
        activo = activo.save flush: true
        return activo
    }

    def asignarInpcMedioMesUso(List ids, BigDecimal inpc) {
        def res = []
        ids.each { id ->
            def af = ActivoFijo.get(id)
            af.inpcPrimeraMitad = inpc
            af.save(flush: true)
            res << af
        }
        return res
    }

    def generarPendientes() {
        log.info('Generando activos fijos pendientes')
        def res = []
        def q = GastoDet.where {activoFijo == true}
        q = q.where {
            def gto = GastoDet
            notExists ActivoFijo.where {
                def s1 = ActivoFijo
                def em2 = gastoDet
                return em2.id == gto.id
            }.id()
        }
        def pendientes = q.list()
        pendientes.each {item -> 
            ActivoFijo af = new ActivoFijo()
            af.with {
                adquisicion = item.cxp.fecha
                descripcion = item.descripcion
                montoOriginal = item.importe
                montoOriginalFiscal = item.importe
                serie = item.serie
                modelo = item.modelo
                facturaSerie = item.cxp.serie
                facturaFolio = item.cxp.folio
                facturaFecha = item.cxp.fecha
                uuid = item.cxp.uuid
                estado = 'VIGENTE'
                cuentaContable = item.cuentaContable
                gastoDet = item
                proveedor = item.cxp.proveedor
                sucursalOrigen = item.sucursal.nombre
                sucursalActual = item.sucursal.nombre
            }
            def inpc = Inpc.where{ejercicio == ej && mes == mm}.find()
            if(inpc) {
                af.inpcDelMesAdquisicion = inpc.tasa
            }
            af.save failOnError: true, flush: true
            res << af
        }
        log.info('Generados: {}', res.size())
        return res
        
    }

    int monthsBetween(Date from, Date to){
        def cfrom = new GregorianCalendar(time:from)
        def cto   = new GregorianCalendar(time:to)
 
        return ((cto.get(Calendar.YEAR) - cfrom.get(Calendar.YEAR)) 
            * cto.getMaximum(Calendar.MONTH)) 
            + (cto.get(Calendar.MONTH) - cfrom.get(Calendar.MONTH))
    }

   
}
