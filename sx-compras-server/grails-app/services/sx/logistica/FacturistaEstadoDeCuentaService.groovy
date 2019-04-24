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
@GrailsCompileStatic
class FacturistaEstadoDeCuentaService implements  LogUser, FolioLog {

    NotaDeCargoService notaDeCargoService

    def calcularInteresesGlobales(Date corte, BigDecimal tasa) {
        List<FacturistaDeEmbarque> facturistas = FacturistaDeEmbarque.list()
        facturistas.each { facturista ->
            calcularInteresesPorFacturista(corte, tasa, facturista)
        }
    }

    List<FacturistaEstadoDeCuenta> calcularInteresesPorFacturista(Date corte, BigDecimal tasa, FacturistaDeEmbarque f) {
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

        if(saldo) {
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

    def generarNotasDeCargoPorIntereses(Date fecha) {
        List<FacturistaDeEmbarque> facturistas = FacturistaDeEmbarque.list()
        facturistas.each { f ->
            generarNotaDeCargo(f, fecha)
        }
    }


    @Transactional
    NotaDeCargo generarNotaDeCargo(FacturistaDeEmbarque f, Date fecha = new Date()) {
        List<FacturistaEstadoDeCuenta> intereses = FacturistaEstadoDeCuenta.where{
                facturista == f &&
                tipo == 'INTERESES' &&
                origen == null
            }.list()
        def importe = intereses.sum 0.0 , {FacturistaEstadoDeCuenta m -> m.importe}
        if( (importe as BigDecimal) <= 0.0)
            return null

        NotaDeCargo nc = new NotaDeCargo()
        nc.tipo = 'CHO'
        nc.cliente = Cliente.where{rfc == f.rfc}.find()
        nc.sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        nc.fecha = fecha
        nc.comentario = 'INTERESES SOBRE PRESTAMOS'
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
        /***** TEMPO **/
        nc.createUser = 'aa'
        nc.updateUser = 'aa'
        nc.cuentaPorCobrar.createUser = 'aa'
        nc.cuentaPorCobrar.updateUser = 'aa'
        /********/
        nc = nc.save failOnError: true, flush: true
        intereses.each {
            it.origen = nc.id
            it.save flush: true
        }

        notaDeCargoService.generarCfdi(nc)
        notaDeCargoService.timbrar(nc)

        return nc
    }


}
