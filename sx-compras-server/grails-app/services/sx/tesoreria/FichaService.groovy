package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.AppConfig
import sx.core.Empresa
import sx.core.Folio
import sx.cxc.Cobro
import sx.cxc.CobroCheque

@Transactional
@Slf4j
@GrailsCompileStatic
class FichaService {

    Ficha registrarIngreso(Ficha ficha){
        if(ficha.ingreso) {
           throw new RuntimeException("Ficha ${ficha.folio} ya tiene ingreso: ${ficha.ingreso.id}")
        }
        Empresa empresa = Empresa.first()
        MovimientoDeCuenta mov = new MovimientoDeCuenta()
        mov.referencia = "Ficha: ${ficha.folio} "
        mov.tipo = ficha.origen;
        mov.fecha = ficha.fecha
        mov.formaDePago = ficha.tipoDeFicha == 'EFECTIVO' ? 'EFECTIVO' : 'CHEQUE'
        mov.comentario = "Ficha ${ficha.tipoDeFicha} ${ficha.sucursal.nombre} "
        mov.cuenta = ficha.cuentaDeBanco
        mov.afavor = empresa.nombre
        mov.importe = ficha.total
        mov.moneda = mov.cuenta.moneda
        mov.concepto = 'VENTAS'
        mov.sucursal = ficha.sucursal.nombre
        generarConceptoDeReporte(mov)
        mov.save failOnError: true, flush: true
        ficha.ingreso = mov
        ficha.save flush: true
        return ficha
    }


    List<Ficha> generar(String formaDePago, Date fecha, String tipo, CuentaDeBanco cuenta) {
        switch (formaDePago) {
            case 'CHEQUE':
                return generarFichasDeCheque(fecha, tipo, cuenta)
            case 'EFECTIVO':
                return [generarFichaDeEfectivo(fecha, tipo, cuenta)]
        }
    }

    List<Ficha> generarFichasDeCheque(Date fecha, String tipo, CuentaDeBanco cuenta) {

        String hql = "from Cobro a " +
                " where date(a.fecha) = ? " +
                " and a.formaDePago = ? " +
                " and a.tipo = ?" +
                " and a.cheque.ficha is null"

        List<Cobro> cobros = Cobro.executeQuery(hql, [fecha, 'CHEQUE', tipo])
        List<Cobro> mismoBanco = cobros.findAll { it.cheque.bancoOrigen.nombre == cuenta.descripcion}
        List<Cobro> otrosBancos = cobros.findAll { it.cheque.bancoOrigen.nombre != cuenta.descripcion}

        List<Ficha> fichasMismo = armarFichas(fecha, new ArrayList(mismoBanco), 'MISMO_BANCO', tipo, cuenta)
        List<Ficha> fichasOtros = armarFichas(fecha, new ArrayList(otrosBancos), 'OTROS_BANCOS', tipo, cuenta)
        fichasMismo.addAll(fichasOtros)
        return fichasMismo
    }

    List<Ficha> armarFichas(Date fecha, List<Cobro> cobros, String tipo, String origen, CuentaDeBanco cuenta) {
        int folio = 1
        List<Cobro> grupo = []
        List<Ficha> fichas = []
        for (int i = 0; i < cobros.size(); i++) {
            Cobro cobro = cobros.get(i)
            if(grupo.size() < 5) {
                grupo << cobro
            } else {
                fichas << generarFicha(fecha, tipo, origen, grupo, cuenta)
                grupo = []
                grupo << cobro
            }
        }
        if (grupo) {
            fichas << generarFicha(fecha, tipo, origen, grupo, cuenta)
        }
        return fichas
    }


    @CompileDynamic
    Ficha generarFicha(Date fecha, String tipo, String origen, List<Cobro> cobros, CuentaDeBanco cuenta) {
        BigDecimal total = cobros.sum (0.0, {it.importe})

        Ficha ficha = new Ficha()
        ficha.fecha = fecha
        ficha.cuentaDeBanco = cuenta
        ficha.tipoDeFicha = tipo
        ficha.sucursal = AppConfig.first().sucursal
        ficha.origen = origen
        ficha.total = total
        ficha.folio = Folio.nextFolio('FICHAS','FICHAS')
        ficha.save failOnError: true, flush: true
        cobros.each {
            it.cheque.ficha = ficha
            it.save flush:true
        }
        log.debug('Fihca generada {}', ficha)
        return ficha
    }

    Ficha generarFichaDeEfectivo(Date fecha, String origen, CuentaDeBanco cuenta) {

        BigDecimal total = Cobro.executeQuery(
                "select sum(c.importe) from Cobro c " +
                        " where date(c.fecha) = ? " +
                        "   and c.tipo = ? " +
                        "   and c.formaDePago = 'EFECTIVO' ",
                [fecha,origen ])[0];
        Ficha ficha = new Ficha()
        ficha.fecha = fecha
        ficha.cuentaDeBanco = cuenta
        ficha.tipoDeFicha = 'EFECTIVO'
        ficha.sucursal = AppConfig.first().sucursal
        ficha.origen = origen
        ficha.total = total
        ficha.folio = Folio.nextFolio('FICHAS','FICHAS')
        ficha.save failOnError: true, flush: true
        log.debug('Fihca generada {}', ficha)
        return ficha
    }

    void cancelarFicha(Ficha ficha) {

        List<CobroCheque> cobros = CobroCheque.where{ficha == ficha}.list()
        cobros.each { cobro ->
            cobro.ficha = null
        }

        if(ficha.ingreso) {
            MovimientoDeCuenta ingreso = ficha.ingreso
            ficha.ingreso = null
            ingreso.delete flush: true
        }
        ficha.delete flush: true
    }

    /**
     * Genera la descripcion adecuada para el estado de cuenta
     *
     * @param ingreso
     */
    def generarConceptoDeReporte(MovimientoDeCuenta ingreso) {
       String c = "Deposito suc: ${ingreso.sucursal}"
        ingreso.conceptoReporte = c
    }
}
