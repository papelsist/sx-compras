package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.core.FolioLog
import sx.core.LogUser

import sx.core.Cliente
import sx.core.Sucursal

import sx.cxc.NotaDeCargo
import sx.cxc.NotaDeCargoDet
import sx.cxc.NotaDeCargoService

import sx.utils.MonedaUtils


@Slf4j
// @GrailsCompileStatic
class FacturistaEstadoDeCuentaService implements  LogUser, FolioLog {

    NotaDeCargoService notaDeCargoService

    def calcularInteresesGlobales(Date corte, BigDecimal tasa) {
        List<FacturistaDeEmbarque> facturistas = FacturistaDeEmbarque.list()
        facturistas.each { facturista ->
            calcularInteresesPorFacturista(corte, tasa, facturista)
        }
    }

    List<FacturistaEstadoDeCuenta> calcularInteresesPorFacturista(Date corte, BigDecimal stasa, FacturistaDeEmbarque f) {
        BigDecimal tasa = MonedaUtils.round(stasa, 4)
        log.info('Calculando intereses de {} al {} Tasa: {}', f.nombre, corte, tasa)
        List<FacturistaEstadoDeCuenta> rows = FacturistaEstadoDeCuenta
                .where{facturista == f}
                .list([sort: 'fecha', 'order': 'asc'])
        BigDecimal saldo = 0.0
        rows.sort {it.fecha}.each {
            saldo += it.importe
            it.saldo = saldo
        }
        List<FacturistaEstadoDeCuenta> movs = []

        if(saldo > 10.00) {
            tasa = (tasa * 2) / 365
            tasa = MonedaUtils.round(tasa, 4)
            BigDecimal intereses = MonedaUtils.round(saldo * tasa/100.00)
            movs << generarMovimiento(f, corte, 'INTERESES', intereses, tasa)
            BigDecimal impuesto = MonedaUtils.calcularImpuesto(intereses)
            movs << generarMovimiento(f, corte, 'INTERESES_IVA', impuesto, tasa)

        }
        return movs
    }

    private FacturistaEstadoDeCuenta generarMovimiento(FacturistaDeEmbarque f, Date corte, String tipo, BigDecimal importe, BigDecimal tasa ) {
        FacturistaEstadoDeCuenta mov = FacturistaEstadoDeCuenta
                .where{ facturista == f &&
                    tipo == tipo &&
                    fecha == corte}
                .find()

        if(!mov) {
            mov = new FacturistaEstadoDeCuenta(
                    facturista: f,
                    nombre: f.nombre,
                    origen: null,
                    tipo: tipo,
                    concepto: 'INTERESES'
            )
        }
        mov.importe = importe
        mov.tasaDeInteres = tasa
        mov.saldo = 0.0
        mov.fecha = corte
        mov.comentario = "TASA DE INTERES ${tasa} %"

        logEntity(mov)
        mov.save(flush: true)
        return mov

    }

    def generarNotasDeCargoPorIntereses(Date fecha, String comentario = 'INTERESES POR PRESTAMO') {
        List<FacturistaDeEmbarque> facturistas = FacturistaDeEmbarque.list()
        List<NotaDeCargo> res = []
        facturistas.each { f ->
            def nota = generarNotaDeCargo(f, fecha, comentario)
            if(nota) {
                res << nota
            }
        }
        return res
    }


    @Transactional
    NotaDeCargo generarNotaDeCargo(FacturistaDeEmbarque f, Date corte = new Date(), String comentario) {
        log.info('Generando N de Cargo por intereses para {}, Corte: {}, Desc: {}', f, corte, comentario)
        
       
        List<FacturistaEstadoDeCuenta> intereses = FacturistaEstadoDeCuenta.where{
                facturista == f &&
                tipo == 'INTERESES' &&
                origen == null &&
                fecha <= corte

            }.list()
    
        def importe = intereses.sum 0.0 , {FacturistaEstadoDeCuenta m -> m.importe}

        def cliente = Cliente.findByNombre(f)
 
        if( (importe as BigDecimal) <= 1.0)
            return null

      

    
        NotaDeCargo nc = new NotaDeCargo()
        nc.tipo = 'CHO'
        nc.formaDePago = 'COMPENSACION'
        nc.cliente = Cliente.where{rfc == f.rfc}.find()
        nc.sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        nc.fecha = new Date()
        // nc.comentario = 'INTERESES POR PRESTAMO DE ENERO A DICIEMBRE 2018'
        nc.comentario = comentario
        nc.importe = importe as BigDecimal
        nc.impuesto = MonedaUtils.calcularImpuesto(nc.importe)
        nc.total = nc.importe + nc.impuesto
        nc.tipoDeCalculo = 'NINGUNO'
        nc.serie = 'CHO'
        nc.folio = nextFolio('NOTA_DE_CARGO', 'CHO')
        nc.usoDeCfdi = 'G03'
        nc.cuentaPorCobrar = notaDeCargoService.generarCuentaPorCobrar(nc)

        NotaDeCargoDet det = new NotaDeCargoDet()
        det.comentario = nc.comentario
        det.concepto = '84101700'
        det.importe = nc.importe
        det.impuesto = nc.impuesto
        det.total = nc.total

        det.documento = 0L
        det.documentoTipo = 'ND'
        det.documentoSaldo = 0.0
        det.documentoTotal = 0.0
        det.documentoFecha = nc.fecha
        det.sucursal = nc.sucursal.nombre

        nc.addToPartidas(det)
        logEntity(nc)
        logEntity(nc.cuentaPorCobrar)

        /** TEMPO **/
        nc.createUser = 'admin'
        nc.updateUser = 'admin'
        nc.cuentaPorCobrar.createUser = 'admin'
        nc.cuentaPorCobrar.updateUser = 'admin'
        /** END TEMPO **/

        nc = nc.save failOnError: true, flush: true
        notaDeCargoService.generarCfdi(nc)
        notaDeCargoService.timbrar(nc)
      

        intereses.each {
            it.origen = nc.id
            it.save failOnError: true, flush: true
        }

     
        return nc
    }


}
