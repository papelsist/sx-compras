package sx.logistica


import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value
import sx.core.LogUser
import sx.inventario.Traslado
import sx.utils.Periodo


@Slf4j
class EnvioComisionService implements  LogUser{

    @Value('${siipapx.logistica.inicioOperacionComisiones}')
    String inicioDeOperacion



    List<EnvioComision> generarComisiones(Date fechaInicial, Date fechaFinal) {
        log.info('Generando comisiones {} {}', fechaInicial, fechaFinal)
        List<Envio> envios = Envio.findAll(
                "from Envio e where date(e.embarque.regreso) between ? and ? " +
                " and e not in (select x.envio from EnvioComision x)", [fechaInicial, fechaFinal])
        log.info('Envios pendientes: {}', envios.size())
        List<EnvioComision> res = []
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
            res << ec
        }
        log.info('Comisiones por venta generadas {}', res.size())
        res.addAll(generarPorTraslado(fechaInicial, fechaFinal))
        return res

    }

    List<EnvioComision> generarPorTraslado(Date fechaInicial, Date fechaFinal) {
        List<Traslado> traslados = Envio.findAll(
                "from Traslado t where date(t.fechaInventario) between ? and ? " +
                        " and cancelado is null " +
                        " and chofer !=null" +
                        " and uuid != null" +
                        " and t not in (select x.traslado from EnvioComision x)", [fechaInicial, fechaFinal])
        List<EnvioComision> res = []
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
            res << ec
        }
        return res
    }

    List<EnvioComision> calcularComisiones(Periodo periodo) {
        log.info('Calculando comisiones de embarquers periodo: {}', periodo)
        List<EnvioComision> comisiones = EnvioComision
                .findAll("from EnvioComision e " +
                " where date(e.embarque.regreso) between ? and ?" +
                " e.fechaComision is null",
                [periodo.fechaInicial, periodo.fechaFinal])
        comisiones.each {ec ->
            cacular(ec)
        }
        return comisiones
    }

    def cacular(EnvioComision ec) {
        Envio e = ec.envio
        String entidad = e.entidad
        if(entidad == '') {}

    }

}
