package server

class UrlMappings {

    static mappings = {

        "/api/sucursales"(resources: 'sucursal')

        "/api/lineas"(resources: 'linea')
        "/api/marcas"(resources: 'marca')
        "/api/clases"(resources: 'clase')
        "/api/productos"(resources: 'producto')
        "/api/proveedores"(resources: 'proveedor'){
            "/productos"(resources: 'proveedorProducto', excludes:['create', 'save', 'edit','patch'])
            "/productos/disponibles"(controller: 'proveedorProducto', action: 'disponibles')
            "/productos/agregarProductos"(controller: 'proveedorProducto', action: 'agregarProductos', method: 'PUT')
            "/saldo"(resources: 'proveedorSaldo', excludes:['create', 'edit','patch'])
        }

        "/api/clientes"(resources: 'cliente')


        "/api/tesoreria/tiposDeCambio"(resources: 'tipoDeCambio')
        "/api/tesoreria/tipoDeCambio/buscar"(controller: 'tipoDeCambio', action: 'buscar', method: 'GET')

        "/api/tesoreria/bancos"(resources: 'banco')

        "/api/tesoreria/cuentas"(resources: 'cuentaDeBanco')
        // "/api/tesoreria/cuentas/$id/movimientos"(controller: 'cuentaDeBanco', action: 'movimientos', method: 'GET')
        "/api/tesoreria/cuentas/$id/movimientos/$ejercicio/$mes"(controller: 'cuentaDeBanco', action: 'movimientos', method: 'GET')
        "/api/tesoreria/cuentas/$id/saldos"(controller: 'cuentaDeBanco', action: 'saldos', method: 'GET')
        "/api/tesoreria/cuentas/estadoDeCuenta"(controller: 'cuentaDeBanco', action: 'estadoDeCuenta', method: 'GET')
        "/api/tesoreria/cuentas/estadoDeCuentaReport"(controller: 'cuentaDeBanco', action: 'estadoDeCuentaReport', method: 'PUT')
        "/api/tesoreria/cuentas/movimientosReport"(controller: 'cuentaDeBanco', action: 'movimientosReport', method: 'PUT')
        "/api/tesoreria/cuentas/$id/cerrar/$ejercicio/$mes"(controller: 'cuentaDeBanco', action: 'cerrar', method: 'PUT')


        "/api/tesoreria/cheques"(resources: 'cheque')
        "/api/tesoreria/cheques/print/$id"(controller: 'cheque', action: 'print', method: 'GET')
        "/api/tesoreria/cheques/printPoliza/$id"(controller: 'cheque', action: 'printPoliza', method: 'GET')
        "/api/tesoreria/cheques/chequesPendientes"(controller: 'cheque', action: 'chequesPendientes', method: 'GET')

        // Fichas de deposito
        "/api/tesoreria/fichas"(resources: "ficha"){
            "/cheques"( controller: 'ficha', action: 'cheques')
            "/registrarIngreso"( controller: 'ficha', action: 'registrarIngreso')
        }
        "/api/tesoreria/fichas/generar"(controller: "ficha", action: 'generar', method: 'POST')
        "/api/tesoreria/fichas/reporteDeRelacionDeFichas"(controller: "ficha", action: 'reporteDeRelacionDeFichas', method: 'GET')
        "/api/tesoreria/fichas/ajustarFicha"(controller: "ficha", action: 'ajustarFicha', method: 'PUT')

        // Cortes de tarjeta
        "/api/tesoreria/cortesTarjeta"(resources: 'corteDeTarjeta')
        "/api/tesoreria/cortesTarjeta/pendientes"( controller: 'corteDeTarjeta', action: 'pendientes')
        "/api/tesoreria/cortesTarjeta/generarCortes"( controller: 'corteDeTarjeta', action: 'generarCortes', method: 'POST')
        "/api/tesoreria/cortesTarjeta/ajustarCobro"( controller: 'corteDeTarjeta', action: 'ajustarCobro', method: 'PUT')
        "/api/tesoreria/cortesTarjeta/aplicar/$id"( controller: 'corteDeTarjeta', action: 'aplicar', method: 'PUT')
        "/api/tesoreria/cortesTarjeta/cancelarAplicacion/$id"( controller: 'corteDeTarjeta', action: 'cancelarAplicacion', method: 'PUT')
        "/api/tesoreria/cortesTarjeta/reporteDeComisionesTarjeta"(controller: 'corteDeTarjeta', action: 'reporteDeComisionesTarjeta', method: 'GET')

        // Traspaso e inversiones
        "/api/tesoreria/traspasos"(resources: 'traspaso', excludes:['create', 'edit','patch'] )
        "/api/tesoreria/inversiones"(resources: 'inversion', excludes:['create', 'edit','patch'] )
        "/api/tesoreria/inversiones/retorno/$id"(controller: 'inversion', action: 'retorno', method: 'PUT')

        // Movimientos genericos
        "/api/tesoreria/movimientos"(resources: 'movimientoDeTesoreria', excludes:['create', 'edit','patch', 'update'] )


        "/api/tesoreria/comisiones"(resources: 'comisionBancaria', excludes:['create', 'edit','patch', 'update'] )

        "/api/tesoreria/comprasMoneda"(resources: 'compraDeMoneda', excludes:['create', 'edit','patch', 'update'] )

        "/api/tesoreria/pagoDeNomina"(resources: 'pagoDeNomina', excludes:['create', 'edit','patch', 'update'] )
        "/api/tesoreria/pagoDeNomina/importar"(controller: 'pagoDeNomina', action: 'importar', method: 'POST')
        "/api/tesoreria/pagoDeNomina/pagar"(controller: 'pagoDeNomina', action: 'pagar', method: 'POST')
        "/api/tesoreria/pagoDeNomina/cancelar/$id"(controller: 'pagoDeNomina', action: 'pagar', method: 'PUT')
        "/api/tesoreria/pagoDeNomina/generarCheque/$id"(controller: 'pagoDeNomina', action: 'generarCheque', method: 'POST')

        "/api/tesoreria/pagoDeMorralla"(resources: 'pagoDeMorralla', excludes:['create', 'edit','patch', 'update'] )
        "/api/tesoreria/pagoDeMorralla/pendientes"(controller: 'pagoDeMorralla', action: 'pendientes', method: 'GET')

        "/api/tesoreria/devoluciones"(resources: 'devolucionCliente', excludes:['create', 'edit','patch', 'update'] )
        "/api/tesoreria/devoluciones/cobros/$id"(controller: 'devolucionCliente', action: 'cobros', method: 'GET')
        "/api/tesoreria/devolucionCliente/generarCheque/$id"(controller: 'devolucionCliente', action: 'generarCheque', method: 'PUT')

        "/api/cxc/cobros"(resources: 'cobro')
        "/api/cxc/cobro/reporteDeCobranza"(controller: "cobro", action: 'reporteDeCobranza', method: 'GET')
        "/api/cxc/cobro/reporteDeRelacionDePagos"(controller: "cobro", action: 'reporteDeRelacionDePagos', method: 'GET')

        "/api/cxc/cobro/reporteDeCobranzaCON"(controller: "cobro", action: 'reporteDeCobranzaCON', method: 'GET')
        "/api/cxc/cobro/reporteDeCobranzaCOD"(controller: "cobro", action: 'reporteDeCobranzaCOD', method: 'GET')

        // Cheques devueltos
        "/api/cxc/chequesDevuetos"(resources: 'chequeDevuelto')
        "/api/cxc/chequesDevuetos/cobros"(controller: 'chequeDevuelto', action: 'cobros', method: 'GET')
        "/api/cxc/chequesDevuetos/reporteDeChequesDevueltos"(controller: "chequeDevuelto", action:'reporteDeChequesDevueltos', method: 'GET')



        "/api/listaDePreciosProveedor"(resources: 'listaDePreciosProveedor')
        "/api/listaDePreciosProveedor/aplicar/$id"(controller: 'listaDePreciosProveedor', action: 'aplicar', method: 'PUT')
        "/api/listaDePreciosProveedor/actualizar/$id"(controller: 'listaDePreciosProveedor', action: 'actualizar', method: 'PUT')
        "/api/listaDePreciosProveedor/actualizarCompras/$id"(controller: 'listaDePreciosProveedor', action: 'actualizarCompras', method: 'PUT')
        "/api/listaDePreciosProveedor/print/$id"(controller: 'listaDePreciosProveedor', action: 'print', method: 'GET')

        // Ordenes de compra
        "/api/compras"(resources: 'compra'){
            "/partidas"(resources: 'compraDet', excludes:['create', 'edit','patch'])
        }
        "/api/compras/cerrar/$id"(controller: 'compra', action: 'cerrar', method: 'PUT')
        "/api/compras/depurar/$id"(controller: 'compra', action: 'depurar', method: 'PUT')
        "/api/compras/print/$id"(controller: 'compra', action: 'print', method: 'GET')


        "/api/comprobanteFiscal"(resources: 'comprobanteFiscal')
        "/api/comprobanteFiscal/xml/$id"(controller: 'comprobanteFiscal', action: 'xml')
        "/api/comprobanteFiscal/pdf/$id"(controller: 'comprobanteFiscal', action: 'pdf')


        "/api/cuentaPorPagar"(resources: 'cuentaPorPagar')
        "/api/cuentaPorPagar/pendientesDeAnalisis/$proveedorId"(controller: 'cuentaPorPagar', action: 'pendientesDeAnalisis')
        "/api/cuentaPorPagar/pendientes/$proveedorId"(controller: 'cuentaPorPagar', action: 'pendientes')

        "/api/analisisDeFactura"(resources: 'analisisDeFactura', excludes:['create', 'edit','patch']) {
            "/partidas"(resources: 'analisisDeFacturaDet', excludes:['create', 'edit','patch'])
        }
        "/api/analisisDeFactura/cerrar/$id"(controller: 'analisisDeFactura', action: 'cerrar', method: 'PUT')
        "/api/analisisDeFactura/print/$id"(controller: 'analisisDeFactura', action: 'print', method: 'GET')
        "/api/analisisDeFactura/entradasAnalizadas"(controller: 'analisisDeFactura', action: 'entradasAnalizadas', method: 'GET')
        "/api/analisisDeFactura/comsSinAnalizar"(controller: 'analisisDeFactura', action: 'comsSinAnalizar', method: 'GET')



        "/api/requisicionesDeCompras"(resources: 'requisicionDeCompras')
        "/api/requisicionesDeCompras/cerrar/$id"(controller:'requisicionDeCompras', action: 'cerrar', method: 'PUT')
        "/api/requisicionesDeCompras/print/$id"(controller: 'requisicionDeCompras', action: 'print', method: 'GET')
        "/api/requisicionesDeCompras/pendientes/$proveedorId"(controller: 'requisicionDeCompras', action: 'pendientes', method: 'GET')
        "/api/requisicionesDeCompras/pagar"(controller: 'requisicionDeCompras', action: 'pagar', method: 'PUT')


        "/api/requisiciones/gastos"(resources: 'requisicionDeGastos')
        "/api/requisiciones/gastos/cerrar/$id"(controller:'requisicionDeGastos', action: 'cerrar', method: 'PUT')
        "/api/requisiciones/gastos/print/$id"(controller: 'requisicionDeGastos', action: 'print', method: 'GET')
        "/api/requisiciones/gastos/pendientes/$proveedorId"(controller: 'requisicionDeGastos', action: 'pendientes', method: 'GET')
        "/api/requisiciones/gastos/pagar"(controller: 'requisicionDeGastos', action: 'pagar', method: 'PUT')

        "/api/requisiciones/pago"(resource: 'pagoDeRequisicion', includes:['show'])
        "/api/requisiciones/pago/pagar"(controller: 'pagoDeRequisicion', action: 'pagar', method: 'PUT')
        "/api/requisiciones/pago/cancelarPago/$id"(controller: 'pagoDeRequisicion', action: 'cancelarPago', method: 'PUT')
        "/api/requisiciones/pago/generarCheque/$id"(controller: 'pagoDeRequisicion', action: 'generarCheque', method: 'PUT')
        "/api/requisiciones/pago/cancelarCheque"(controller: 'pagoDeRequisicion', action: 'cancelarCheque', method: 'PUT')


        "/api/cxp/contrarecibos"(resources: 'contrarecibo')
        "/api/cxp/contrarecibos/print/$id"(controller: 'contrarecibo', action: 'print', method: 'GET')
        "/api/cxp/contrarecibos/pendientes/$proveedorId"(controller: 'contrarecibo', action: 'pendientes', method: 'GET')

        "/api/cxp/notas"(resources: 'notaDeCreditoCxP', excludes:['create', 'edit','patch'])
        "/api/cxp/notas/aplicar/$id"(controller:'notaDeCreditoCxP', action: 'aplicar', method: 'PUT')
        "/api/cxp/notas/print/$id"(controller: 'notaDeCreditoCxP', action: 'print', method: 'GET')


        "/api/cxp/pagos"(resources: 'pago', excludes:['create', 'edit','patch'])
        "/api/cxp/pagos/aplicar/$id"(controller:'pago', action: 'aplicar', method: 'PUT')
        "/api/cxp/pagos/search"(controller: 'pago', action: 'search')

        "/api/cxp/aplicaciones"(resources: 'aplicacionDePago', excludes:['create', 'edit','patch'])


        "/api/coms"(resources: 'recepcionDeCompra'){
            "/partidas"(resources: 'recepcionDeCompraDet', excludes:['create', 'edit','patch'])
        }
        "/api/coms/pendientesDeAnalisis/$id"(controller: 'recepcionDeCompra', action: 'pendientesDeAnalisis')
        "/api/coms/print/$id"(controller: 'recepcionDeCompra', action: 'print', method: 'GET')
        "/api/coms/recepcionesPorDia"(controller: 'recepcionDeCompra', action: 'recepcionesPorDia', method: 'GET')

        "/api/costos"(resources: 'costoPromedio', excludes:['create', 'edit','patch', 'update', 'save'])
        "/api/costos/$ejercicio/$mes"(controller: 'costoPromedio', action: 'costos', method: 'GET')
        "/api/costos/calcular/$ejercicio/$mes"(controller: 'costoPromedio', action: 'calcular', method: 'POST')
        "/api/costos/costeoMedidasEspeciales"(controller: 'costoPromedio', action: 'costeoMedidasEspeciales', method: 'POST')
        "/api/costos/calcularPorProducto/$ejercicio/$mes"(controller: 'costoPromedio', action: 'calcularPorProducto', method: 'PUT')

        "/api/costos/aplicar/$ejercicio/$mes"(controller: 'costoPromedio', action: 'aplicar', method: 'POST')
        "/api/costos/movimientos/$ejercicio/$mes"(controller: 'costoPromedio', action: 'movimientos', method: 'GET')
        "/api/costos/calculoDeCostoPromedio"(controller: 'costoPromedio', action: 'calculoDeCostoPromedio')
        "/api/costos/inventarioCosteado"(controller: 'costoPromedio', action: 'inventarioCosteado')
        "/api/costos/movimientosCosteados"(controller: 'costoPromedio', action: 'movimientosCosteados')
        "/api/costos/mercanciaEnTransito"(controller: 'costoPromedio', action: 'mercanciaEnTransito')
        "/api/costos/facturasAnalizadas"(controller: 'costoPromedio', action: 'facturasAnalizadas')
        "/api/costos/movimientosCosteadosDeDocumentos"(controller: 'costoPromedio', action: 'movimientosCosteadosDeDocumentos')
        "/api/costos/movimientosCosteadosDet"(controller: 'costoPromedio', action: 'movimientosCosteadosDet')

        "/api/inventario"(resources: 'inventario', excludes:['create', 'update', 'save', 'edit','patch'])
        "/api/inventario/$producto/$ejercicio/$mes"(controller: 'inventario', action: 'movimientos', method: 'GET')
        "/api/inventario/printKardex"(controller: 'inventario', action: 'printKardex', method: 'GET')
        // TEMPORALMENTE EN ESTE CONTROLADOR
        "/api/inventario/ventasDiarias"(controller: 'inventario', action: 'ventasDiarias', method: 'GET')


        // Rembolsos
        "/api/rembolsos"(resources: 'rembolso', excludes:['create', 'edit','patch']) {
            "/partidas"(resources: 'rembolsoDet', excludes:['create', 'edit','patch'])
        }
        "/api/rembolsos/pagar"(controller: 'rembolso', action: 'pagar', method: 'PUT')
        "/api/rembolsos/cancelarPago/$id"(controller: 'rembolso', action: 'cancelarPago', method: 'PUT')
        "/api/rembolsos/cancelarCheque/$id"(controller: 'rembolso', action: 'cancelarCheque', method: 'PUT')
        "/api/rembolsos/generarCheque/$id"(controller: 'rembolso', action: 'generarCheque', method: 'PUT')
        "/api/rembolsos/pendientes"(controller: 'rembolso', action: 'pendientes')
        "/api/rembolsos/print/$id"(controller: 'rembolso', action: 'print')

        //BI
        "/api/bi/ventaNetaMensual"(controller: 'bi', action:'ventaNetaMensual', method: 'GET')
        "/api/bi/movimientoCosteado"(controller: 'bi', action:'movimientoCosteado', method:'GET')
        "/api/bi/movimientoCosteadoDet"(controller: 'bi', action:'movimientoCosteadoDet', method: 'GET')
        // Reportes BI
        "/api/bi/bajaEnVentas"(controller: 'bi', action:'bajaEnVentas', method: 'GET')
        "/api/bi/mejoresClientes"(controller: 'bi', action:'mejoresClientes', method: 'GET')
        "/api/bi/ventasClientesResumen"(controller: 'bi', action:'ventasClientesResumen', method: 'GET')
        "/api/bi/clienteSinVentas"(controller: 'bi', action:'clienteSinVentas', method: 'GET')

        //Contabilidad
        "/api/contabilidad/cuentas"(resources: 'cuentaContable', excludes:['create', 'edit','patch'])
        "/api/contabilidad/polizas"(resources: 'poliza', excludes: ['create', 'edit', 'patch'])
        "/api/contabilidad/polizas"(resources: 'poliza'){
            "/partidas"(resources: 'polizaDet', excludes:['create', 'edit','patch'])
        }
        "/api/contabilidad/polizas/generarPolizas"(controller: 'poliza', action: 'generarPolizas', method: 'POST')
        "/api/contabilidad/polizas/generarPolizasEgreso"(controller: 'poliza', action: 'generarPolizasEgreso', method: 'POST')
        "/api/contabilidad/polizas/recalcular/$id"(controller: 'poliza', action: 'recalcular', method: 'PUT')
        "/api/contabilidad/polizas/cerrar/$id"(controller: 'poliza', action: 'cerrar', method: 'PUT')
        "/api/contabilidad/polizas/print/$id"(controller: 'poliza', action: 'print')
        "/api/contabilidad/polizas/printComprobantes/$id"(controller: 'poliza', action: 'printComprobantes')
        "/api/contabilidad/polizas/generarComplementos/$id"(controller: 'poliza', action: 'generarComplementos', method: 'PUT')
        "/api/contabilidad/polizas/generarFolios/$subtipo/$ejercicio/$mes"(controller: 'poliza', action: 'generarFolios', method: 'PUT')
        "/api/contabilidad/saldos"(resources: 'saldoPorCuentaContable', excludes: ['create', 'edit', 'patch'])
        "/api/contabilidad/saldos/actualizar/$ejercicio/$mes"(controller: 'saldoPorCuentaContable', action: 'actualizarSaldos', method: 'PUT')
        "/api/contabilidad/saldos/cierreMensual/$ejercicio/$mes"(controller: 'saldoPorCuentaContable', action: 'cierreMensual', method: 'PUT')
        "/api/contabilidad/saldos/cierreAnual/$ejercicio"(controller: 'saldoPorCuentaContable', action: 'cierreAnual', method: 'PUT')
        "/api/contabilidad/saldos/printAuxiliar"(controller: 'saldoPorCuentaContable', action: 'printAuxiliar')
        "/api/contabilidad/saldos/drillPeriodo"(controller: 'saldoPorCuentaContable', action: 'drillPeriodo')
        "/api/contabilidad/saldos/drillSubtipo"(controller: 'saldoPorCuentaContable', action: 'drillSubtipo', method: 'POST')

        "/api/sat/cuentas"(resources: 'cuentaSat', excludes: ['create', 'edit', 'patch'])

        // Cfdis
        "/api/cfdi"(resources: 'cfdi', excludes:['create', 'edit', 'patch', 'update', 'save', 'delete'])
        "/api/cfdi/cancelacion"(resources: 'cancelacionDeCfdi', excludes:['create', 'edit','patch', 'save'])
        "/api/cfdi/cancelacion/pendientes"(controller: 'cancelacionDeCfdi', action: 'pendientes')
        "/api/cfdi/cancelacion/cancelar/$id"(controller: 'cancelacionDeCfdi', action: 'cancelar', method: 'PUT')
        "/api/cfdi/cancelacion/mostrarAcuse/$id"(controller:"cancelacionDeCfdi", action:"mostrarAcuse")
        "/api/cfdi/cancelacion/descargarAcuse/$id"(controller:"cancelacionDeCfdi", action:"descargarAcuse", method: 'GET')
        "/api/cfdi/cancelacion/reporteDeCancelados"(controller:"cancelacionDeCfdi", action:"reporteDeCancelados", method: 'GET')
        "/api/cfdi/cancelacion/reporteDePendientes"(controller:"cancelacionDeCfdi", action:"reporteDePendientes", method: 'GET')
        "/api/cfdi/cancelacion/facturasCanceladas"(controller:"cancelacionDeCfdi", action:"facturasCanceladas", method: 'GET')


        // ************** Contabilidad electronica *************//
        "/api/sat/catalogo"(resources: 'catalogoDeCuentas', excludes:['create', 'edit', 'update', 'patch'])
        "/api/sat/catalogo/mostrarXml/$id"(controller:"catalogoDeCuentas", action:"mostrarXml")
        "/api/sat/catalogo/mostrarAcuse/$id"(controller:"catalogoDeCuentas", action:"mostrarAcuse")
        "/api/sat/catalogo/descargarXml/$id"(controller:"catalogoDeCuentas", action:"descargarXml")

        // Balanza SAT
        "/api/sat/balanza"(resources: 'balanzaSat', excludes:['create', 'edit', 'update', 'patch'])
        "/api/sat/balanza/mostrarXml/$id"(controller:"balanzaSat", action:"mostrarXml")
        "/api/sat/balanza/mostrarAcuse/$id"(controller:"balanzaSat", action:"mostrarAcuse")
        "/api/sat/balanza/descargarXml/$id"(controller:"balanzaSat", action:"descargarXml")

        // Polizas del periodo SAT
        "/api/sat/polizas"(resources: 'polizasDelPeriodoSat', excludes:['create', 'edit', 'update', 'patch'])
        "/api/sat/polizas/mostrarXml/$id"(controller:"polizasDelPeriodoSat", action:"mostrarXml")
        "/api/sat/polizas/mostrarAcuse/$id"(controller:"polizasDelPeriodoSat", action:"mostrarAcuse")
        "/api/sat/polizas/descargarXml/$id"(controller:"polizasDelPeriodoSat", action:"descargarXml")

        // Embarques
        "/api/embarques"(resources: 'embarque', excludes:['create', 'edit','patch', 'save', 'update', 'delete'])
        "/api/envios"(resources: 'envio', excludes:['create', 'edit','patch', 'save','update', 'delete']) {
            "/partidas"(resources: 'envioDet', excludes:['create', 'edit','patch', 'save', 'update', 'delete'])
        }
        "/api/embarques/comisiones"(resources: "envioComision", excludes: ['create', 'edit', 'patch'])
        "/api/embarques/comisiones/generar"(controller: 'envioComision', action: 'generar', method: 'POST')

        "/api/prestamoChofer"(resources: 'prestamoChofer', excludes:['create', 'edit','patch']){
            "/partidas"(resources: 'prestamoChoferDet', excludes:['create', 'edit','patch'])
        }


        "/"(controller: 'application', action:'index')
        "/api/session"(controller: 'application', action: 'session')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
