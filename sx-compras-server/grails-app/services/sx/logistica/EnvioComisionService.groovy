package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value
import sx.core.LogUser
import sx.inventario.Traslado
import sx.utils.Periodo

// @GrailsCompileStatic
@Slf4j
class EnvioComisionService implements  LogUser{

    @Value('${siipapx.logistica.inicioOperacionComisiones}')
    String inicioDeOperacion



    def generarComisiones(Date fechaInicial, Date fechaFinal) {
        log.info('Generando comisiones {} {}', fechaInicial, fechaFinal)
        List<Envio> envios = Envio.findAll(
                "from Envio e where date(e.embarque.regreso) between ? and ? " +
                " and e not in (select x.envio from EnvioComision x)", [fechaInicial, fechaFinal])
        log.info('Envios pendientes: {}', envios.size())
        envios.each { e ->
            EnvioComision ec = new EnvioComision(
                    chofer: e.embarque.chofer,
                    comision: e.embarque.chofer.comision,
                    nombre: e.embarque.chofer.nombre,
                    envio:e,
                    valor: e.valor,
                    kilos: e.kilos,
                    regreso: e.embarque.regreso,
                    maniobra: e.maniobra ?: 0.0,
                    sucursal: e.embarque.sucursal.nombre,
                    precioTonelada: e.precioTonelada ?: 0.0,
                    createUser: 'NA',
                    updateUser: 'NA'
            )
            logEntity(ec)
            ec.save failOnError: true, flush: true
        }
        generarPorTraslado(fechaInicial, fechaFinal)

    }

    def generarPorTraslado(Date fechaInicial, Date fechaFinal) {
        List<Traslado> traslados = Envio.findAll(
                "from Traslado t where date(t.fechaInventario) between ? and ? " +
                        " and cancelado is null " +
                        " and chofer !=null" +
                        " and uuid != null" +
                        " and t not in (select x.traslado from EnvioComision x)", [fechaInicial, fechaFinal])
        traslados.each { t ->
            EnvioComision ec = new EnvioComision(
                    chofer: t.chofer,
                    comision: t.chofer.comision,
                    nombre: t.chofer.nombre,
                    traslado: t,
                    valor: 0.0,
                    kilos: t.kilos,
                    regreso: t.fechaInventario,
                    maniobra: 0.0,
                    sucursal: t.sucursal.nombre,
                    precioTonelada: t.chofer.precioTonelada,
                    createUser: 'NA',
                    updateUser: 'NA'
            )
            logEntity(ec)
            ec.save failOnError: true, flush: true
        }
    }

    def calcularComisiones(Periodo periodo) {
        List<EnvioComision> comisiones = EnvioComision
                .findAll("from EnvioComision e " +
                " where date(e.embarque.regreso) between ? and ?" +
                " e.fechaComision is null",
                [periodo.fechaInicial, periodo.fechaFinal])
    }

    def cacularComisione(EnvioComision ec) {
        Envio e = ec.envio
        String entidad = e.entidad
        if(entidad == '') {}

    }


    Date getInicio() {
        return Date.parse('dd/MM/yyyy', this.inicioDeOperacion)
    }
}
