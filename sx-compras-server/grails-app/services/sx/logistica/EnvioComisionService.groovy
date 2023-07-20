package sx.logistica


import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value

import sx.core.LogUser
import sx.core.Venta
import sx.core.VentaDet
import sx.inventario.Traslado
import sx.inventario.Transformacion
import sx.utils.Periodo


@Slf4j
class EnvioComisionService implements  LogUser{

    List<String> EXCLUIR = ['3ba15718-e40e-11e7-b1f8-b4b52f67eab0', '3ba15bf0-e40e-11e7-b1f8-b4b52f67eab0']

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
                    comision: e.embarque.chofer.comision?: 0.0,
                    nombre: e.embarque.chofer.nombre,
                    envio:e,
                    cliente: e.cliente.nombre,
                    valor: e.valor,
                    kilos: e.kilos,
                    regreso: e.embarque.regreso,
                    maniobra: e.maniobra ?: 0.0,
                    sucursal: e.embarque.sucursal.nombre,
                    precioTonelada: e.precioTonelada ?: 0.0,
                    createUser: 'NA',
                    updateUser: 'NA',
                    comisionPorTonelada: false,

            )
            logEntity(ec)
            actualizarOtrosImportes(ec)
            actualizarDocumento(ec)
            ec.save failOnError: true, flush: true
            res << ec

        }
        log.info('Comisiones por venta generadas {}', res.size())
        res.addAll(generarPorTraslado(fechaInicial, fechaFinal))
        res.addAll(generarPorTransformacion(fechaInicial, fechaFinal))
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
            // t.solicitudDeTraslado.s
            EnvioComision ec = new EnvioComision(
                    chofer: t.chofer,
                    comision: t.chofer.comision ?: 0.0,
                    nombre: t.chofer.nombre,
                    traslado: t,
                    cliente: t.solicitudDeTraslado.sucursalSolicita.nombre,
                    valor: 0.0,
                    kilos: t.kilos,
                    regreso: t.fechaInventario,
                    maniobra: 0.0,
                    sucursal: t.sucursal.nombre,
                    precioTonelada: t.chofer.precioTonelada,
                    createUser: 'NA',
                    updateUser: 'NA',
                    comisionPorTonelada: true,
            )

            if(t.solicitudDeTraslado.sucursalSolicita.nombre == 'ANDRADE' && t.solicitudDeTraslado.sucursalAtiende.nombre == 'VERTIZ 176') {
                ec.precioTonelada = 50.00
            }
            if(t.solicitudDeTraslado.sucursalSolicita.nombre == 'VERTIZ 176' && t.solicitudDeTraslado.sucursalAtiende.nombre == 'ANDRADE') {
                ec.precioTonelada = 50.00
            }

            logEntity(ec)
            actualizarDocumento(ec)
            ec.save failOnError: true, flush: true
            res << ec
        }
        return res
    }

    List<EnvioComision> generarPorTransformacion(Date fechaInicial, Date fechaFinal) {

        List<Transformacion> rows = Transformacion.findAll(
                "from Transformacion t where date(t.fechaInventario) between ? and ? " +
                        " and t.cancelado is null " +
                        " and t.chofer is not null" +
                        " and t.tipo = ?" +
                        " and t not in (select x.transformacion from EnvioComision x)", [fechaInicial, fechaFinal, 'MAQ'])
        log.info('TRS: {}', rows.size())

        List<EnvioComision> res = []
        rows.each { trs ->

            def chofer = trs.chofer
            def kilos = trs.partidas.sum 0.0, { 
                if(it.cantidad > 0)
                    return it.inventario.kilos
                else return 0
            }

            EnvioComision ec = new EnvioComision(
                chofer: chofer,
                comision: chofer.comision ?: 0.0,
                nombre: chofer.nombre,
                transformacion: trs,
                cliente: trs.sucursal.nombre,
                valor: 0.0,
                kilos: kilos,
                regreso: trs.fechaInventario,
                maniobra: 0.0,
                sucursal: trs.sucursal.nombre,
                precioTonelada: chofer.precioTonelada,
                createUser: 'NA',
                updateUser: 'NA',
                comisionPorTonelada: true,
                documentoFolio: trs.documento.toString(),
                documentoFecha: trs.fecha,
                documentoTipo: 'MAQ'
            )
            logEntity(ec)
            ec.save failOnError: true, flush: true
            res << ec
        }
        return res
    }

    List<EnvioComision> calcularComisiones(Periodo periodo) {
        log.info('Calculando la comision de los envios para el periodo: {}', periodo)
        List<EnvioComision> comisiones = EnvioComision
                .findAll("""
            from EnvioComision e  where date(e.regreso) between ? and ? and e.manual = false
              and e.chofer.id not in ('3ba15718-e40e-11e7-b1f8-b4b52f67eab0', '3ba15bf0-e40e-11e7-b1f8-b4b52f67eab0')
            """,
                [periodo.fechaInicial, periodo.fechaFinal])
        comisiones.each {ec ->
            ec.precioTonelada = ec.chofer.precioTonelada
            if(ec.envio && ec.envio.cliente &&  !this.EXCLUIR.contains(ec.envio.cliente.id)) {
                ClienteDistribuidor found = ClienteDistribuidor.where{cliente == ec.envio.cliente.id}.find()
                if(found) {
                    ec.comisionPorTonelada = true
                    ec.comentarioDeComision = "DISTRIBUIDOR"
                    ec.precioTonelada = found.precioTonelada
                }
            }
            if(ec.comisionPorTonelada) {
                calclarPorTonelada(ec)
            } else {
                calcularPorEnvio(ec)
            }
        }
        return comisiones
    }

    EnvioComision calcular(EnvioComision ec) {
        if(ec.comisionPorTonelada) {
            return calclarPorTonelada(ec)
        } else {
            return calcularPorEnvio(ec)
        }
    }



    def calclarPorTonelada(EnvioComision ec) {
        log.info('Calculando comision por tonelada...{}', ec)
        BigDecimal toneladas = ec.kilos / 1000.00
        ec.importeComision = toneladas * ec.precioTonelada
        ec.fechaComision = new Date()
        ec.comision = 0.0
        ec.save flush: true
    }

    def calcularPorEnvio(EnvioComision ec) {
        ec.valor = ec.envio.valor
        ec.precioTonelada = 0.0
        ec.importeComision = (ec.comision * (ec.valor + (ec.valorCajas * 0.5) )) / 100.00
        ec.fechaComision = new Date()
        ec.save flush: true

    }

    def actualizarOtrosImportes(EnvioComision ec) {
        if(ec.envio ) {
            if(ec.envio.entidad == 'VENTA') {

                if(ec.envio.parcial) {
                    List<EnvioDet> found = ec.envio.partidas.findAll(
                            {it.producto.clase.clase == 'CAJA CORRUGADO'})
                    BigDecimal importe = found.sum 0.0, {it.valor}
                    ec.valorCajas = importe
                } else {
                    List<VentaDet> partidas = VentaDet
                            .where{venta.id == ec.envio.origen && producto.clase.clase == 'CAJA CORRUGADO'}.list()
                    if(partidas) {
                        BigDecimal importe = partidas.sum 0.0, {it.subtotal}
                        ec.valorCajas = importe
                    }
                }
            }
        }
    }

    def actualizarDocumento(EnvioComision ec) {
        if(ec.envio ) {
            if(ec.envio.entidad == 'VENTA') {

                Venta venta = Venta.get(ec.envio.origen)
                if(venta && venta.cuentaPorCobrar) {
                    ec.documentoFolio = venta.cuentaPorCobrar.documento
                    ec.documentoFecha = venta.cuentaPorCobrar.fecha
                    ec.documentoTipo = venta.cuentaPorCobrar.tipo
                    ec.maniobra = venta.cargosPorManiobra
                }
            }
        }

        if(ec.traslado) {
            ec.documentoFolio = ec.traslado.documento.toString()
            ec.documentoFecha = ec.traslado.fecha
            ec.documentoTipo = 'TPS'
        }
    }

}
