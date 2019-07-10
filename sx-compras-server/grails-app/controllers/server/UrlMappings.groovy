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
        "/api/tesoreria/fichas/cajeras"(controller: "ficha", action: 'cajeras', method: 'GET')

        // Cortes de tarjeta
        "/api/tesoreria/cortesTarjeta"(resources: 'corteDeTarjeta')
        "/api/tesoreria/cortesTarjeta/pendientes"( controller: 'corteDeTarjeta', action: 'pendientes')
        "/api/tesoreria/cortesTarjeta/generarCortes"( controller: 'corteDeTarjeta', action: 'generarCortes', method: 'POST')
        "/api/tesoreria/cortesTarjeta/ajustarCobro"( controller: 'corteDeTarjeta', action: 'ajustarCobro', method: 'PUT')
        "/api/tesoreria/cortesTarjeta/aplicar/$id"( controller: 'corteDeTarjeta', action: 'aplicar', method: 'PUT')
        "/api/tesoreria/cortesTarjeta/cancelarAplicacion/$id"( controller: 'corteDeTarjeta', action: 'cancelarAplicacion', method: 'PUT')
        "/api/tesoreria/cortesTarjeta/reporteDeComisionesTarjeta"(controller: 'corteDeTarjeta', action: 'reporteDeComisionesTarjeta', method: 'GET')

        "/api/tesoreria/cortesTarjetaAplicacion"(resources: 'corteDeTarjetaAplicacion', excludes: ['create', 'edit','patch'] )
        "/api/tesoreria/updateDeposito"(controller: 'corteDeTarjetaAplicacion',action: 'actualizarCorte' , method: 'GET' )

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

        // Solicitudes de deposito
        "/api/tesoreria/solicitudes"(resources: "solicitudDeDeposito")
        "/api/tesoreria/solicitudes/pendientes"( controller: 'solicitudDeDeposito', action: 'pendientes')
        "/api/tesoreria/solicitudes/autorizadas"( controller: 'solicitudDeDeposito', action: 'autorizadas')
        "/api/tesoreria/solicitudes/transito"( controller: 'solicitudDeDeposito', action: 'transito')
        "/api/tesoreria/solicitudes/canceladas"( controller: 'solicitudDeDeposito', action: 'canceladas')
        "/api/tesoreria/solicitudes/autorizar/$id"( controller: 'solicitudDeDeposito', action: 'autorizar')
        "/api/tesoreria/solicitudes/posponer/$id"( controller: 'solicitudDeDeposito', action: 'posponer')
        "/api/tesoreria/solicitudes/rechazar/$id"( controller: 'solicitudDeDeposito', action: 'rechazar')
        "/api/tesoreria/solicitudes/cancelar/$id"( controller: 'solicitudDeDeposito', action: 'cancelar')
        "/api/tesoreria/solicitudes/buscarDuplicada/$id"( controller: 'solicitudDeDeposito', action: 'buscarDuplicada')
        "/api/tesoreria/solicitudes/ingreso/$id"( controller: 'solicitudDeDeposito', action: 'ingreso', method: 'PUT')
        "/api/tesoreria/solicitudes/cobranzaContado"(controller: 'solicitudDeDeposito', action: 'cobranzaContado', method: 'GET')
        "/api/tesoreria/solicitudes/cobranzaCod"(controller: 'solicitudDeDeposito', action: 'cobranzaCod',  method: 'GET')
        "/api/tesoreria/solicitudes/disponibles"(controller: 'solicitudDeDeposito', action: 'disponibles',  method: 'GET')
        "/api/tesoreria/solicitudes/ventasDiarias"(controller: 'solicitudDeDeposito', action: 'ventasDiarias',  method: 'GET')

        /*** Cuentas por Cobrar **/
        "/api/cuentasPorCobrar"(resources: 'cuentaPorCobrar', excludes:['create', 'edit','patch'])
        "/api/cuentasPorCobrar/pendientes/$id"(controller: 'cuentaPorCobrar', action: 'pendientes', method: 'GET')



        "/api/cxc/cobros"(resources: 'cobro')
        "/api/cxc/cobros/aplicar/$id"(controller: "cobro", action: 'aplicar', method: 'PUT')
        "/api/cxc/cobros/eliminarAplicacion/$id"(controller: "cobro", action: 'eliminarAplicacion', method: 'PUT')
        "/api/cxc/cobro/reporteDeCobranza"(controller: "cobro", action: 'reporteDeCobranza', method: 'GET')
        "/api/cxc/cobro/reporteDeRelacionDePagos"(controller: "cobro", action: 'reporteDeRelacionDePagos', method: 'GET')
        "/api/cxc/cobro/ajustarFormaDePago/$id"(controller: "cobro", action: 'ajustarFormaDePago', method: 'PUT')
        "/api/cxc/cobro/reporteDeCobranzaCON"(controller: "cobro", action: 'reporteDeCobranzaCON', method: 'GET')
        "/api/cxc/cobro/reporteDeCobranzaCOD"(controller: "cobro", action: 'reporteDeCobranzaCOD', method: 'GET')
        "/api/cxc/cobro/reporteComisionTarjetas"(controller: "cobro", action: 'reporteComisionTarjetas', method: 'GET')

        // Cheques devueltos
        "/api/cxc/chequesDevuetos"(resources: 'chequeDevuelto')
        "/api/cxc/chequesDevuetos/cobros"(controller: 'chequeDevuelto', action: 'cobros', method: 'GET')
        "/api/cxc/chequesDevuetos/reporteDeChequesDevueltos"(controller: "chequeDevuelto", action:'reporteDeChequesDevueltos', method: 'GET')
        "/api/cxc/chequesDevuetos/generarNotaDeCargo/$id"(controller: 'chequeDevuelto', action: 'generarNotaDeCargo', method: 'POST')

        // Notas de Cargo
        "/api/cxc/notasDeCargo"(resources: "notaDeCargo")
        // "/api/cxc/notasDeCargo/timbrar/$id"(controller: 'notaDeCargo', action: 'timbrar', method: 'POST')
        // "/api/cxc/notasDeCargo/print/$id"(controller: 'notaDeCargo', action: 'print', method: 'GET')
        // "/api/cxc/notasDeCargo/reporteDeNotasDeCargo"(controller: 'notaDeCargo', action: 'reporteDeNotasDeCargo', method: 'GET')

        // CXC Notas de credito
        "/api/cxc/notas"(resources: "notaDeCredito", excludes: ['create', 'edit','patch'])
        "/api/cxc/notas/generarCfdi/$id"(controller: 'notaDeCredito', action: 'generarCfdi', method: 'POST')
        "/api/cxc/notas/aplicar/$id"(controller: 'notaDeCredito', action: 'aplicar', method: 'PUT')



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
        "/api/contabilidad/polizas/prorratearPartida/$id"(controller: 'poliza', action: 'prorratearPartida', method: 'PUT')
        "/api/contabilidad/polizas/copiar/$id"(controller: 'poliza', action: 'copiar', method: 'POST')

        "/api/contabilidad/saldos"(resources: 'saldoPorCuentaContable', excludes: ['create', 'edit', 'patch'])
        "/api/contabilidad/saldos/actualizar/$ejercicio/$mes"(controller: 'saldoPorCuentaContable', action: 'actualizarSaldos', method: 'PUT')
        "/api/contabilidad/saldos/cierreMensual/$ejercicio/$mes"(controller: 'saldoPorCuentaContable', action: 'cierreMensual', method: 'PUT')
        "/api/contabilidad/saldos/cierreAnual/$ejercicio"(controller: 'saldoPorCuentaContable', action: 'cierreAnual', method: 'PUT')
        "/api/contabilidad/saldos/loadMovimientos"(controller: 'saldoPorCuentaContable', action: 'loadMovimientos')


        "/api/contabilidad/saldos/drillPeriodo"(controller: 'saldoPorCuentaContable', action: 'drillPeriodo')
        "/api/contabilidad/saldos/drillSubtipo"(controller: 'saldoPorCuentaContable', action: 'drillSubtipo', method: 'POST')
        "/api/contabilidad/saldos/drill/$id"(controller: 'saldoPorCuentaContable', action: 'drill', method: 'GET')
        "/api/contabilidad/saldos/balanza"(controller: 'saldoPorCuentaContable', action: 'banalza', method: 'GET')
        "/api/contabilidad/saldos/reclasificar"(controller: 'saldoPorCuentaContable', action: 'reclasificar', method: 'POST')

        "/api/contabilidad/diot"(resources: 'diot', excludes:['create', 'edit','patch'])

        "/api/sat/cuentas"(resources: 'cuentaSat', excludes: ['create', 'edit', 'patch'])

        // Auxiliares
        "/api/contabilidad/auxiliar"(controller: 'auxiliares', action: 'auxiliar', method: 'GET')
        "/api/contabilidad/auxiliar/printAuxiliar"(controller: 'auxiliar', action: 'printAuxiliar')
        "/api/contabilidad/auxiliarBancos"(controller: 'auxiliares', action: 'bancos', method: 'GET')

        // Cfdis
        "/api/cfdi"(resources: 'cfdi', excludes:['create', 'edit', 'patch', 'update', 'save', 'delete'])
        "/api/cfdi/print/$id"(controller:"cfdi", action:"print")
        "/api/cfdi/mostrarXml/$id?"(controller:"cfdi", action:"mostrarXml")
        "/api/cfdi/descargarXml/$id?"(controller:"cfdi", action:"descargarXml", method: 'GET')
        "/api/cfdi/email/$id?"(controller:"cfdi", action:"email", method: 'GET')


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
        "/api/choferes"(resources: 'chofer', excludes:['create', 'edit','patch'])
        "/api/embarques"(resources: 'embarque', excludes:['create', 'edit','patch', 'save', 'update', 'delete'])
        "/api/envios"(resources: 'envio', excludes:['create', 'edit','patch', 'save','update', 'delete']) {
            "/partidas"(resources: 'envioDet', excludes:['create', 'edit','patch', 'save', 'update', 'delete'])
        }
        "/api/embarques/comisiones"(resources: "envioComision", excludes: ['create', 'edit', 'patch'])
        "/api/embarques/comisiones/generar"(controller: 'envioComision', action: 'generar', method: 'POST')
        "/api/embarques/comisiones/batchUpdate"(controller: 'envioComision', action: 'batchUpdate', method: 'PUT')
        "/api/embarques/comisiones/entregasPorChofer"(controller: 'envioComision', action: 'entregasPorChofer')
        "/api/embarques/comisiones/comisionesPorFacturista"(controller: 'envioComision', action: 'comisionesPorFacturista')
        "/api/embarques/comisiones/analisisDeEmbarque"(controller: 'envioComision', action: 'analisisDeEmbarque')
        "/api/embarques/comisiones/relacionDePagosDeFletes"(controller: 'envioComision', action: 'relacionDePagosDeFletes')
        "/api/embarques/comisiones/solicitudDeFacturacionDeFletes"(controller: 'envioComision', action: 'solicitudDeFacturacionDeFletes')


        // Prestamos
        "/api/embarques/facturistaPrestamo"(resources: 'facturistaPrestamo', excludes:['create', 'edit','patch'])
        "/api/embarques/facturistaOtroCargo"(resources: 'facturistaOtroCargo', excludes:['create', 'edit','patch'])
        "/api/embarques/facturistaEstadoDeCuenta"(resources: 'facturistaEstadoDeCuenta', excludes:['create', 'save', 'edit', 'update','patch'])
        "/api/embarques/facturistaEstadoDeCuenta/calcularIntereses"(controller: 'facturistaEstadoDeCuenta', action: 'calcularIntereses', method: 'POST')
        "/api/embarques/facturistaEstadoDeCuenta/estadoDeCuenta"(controller: 'facturistaEstadoDeCuenta', action: 'estadoDeCuenta')
        "/api/embarques/facturistaEstadoDeCuenta/generarNotaDeCargo/$id"(controller: 'facturistaEstadoDeCuenta', action: 'generarNotaDeCargo', method: 'PUT')


        // SolicitudDeDepositos

        // Activo Fijo
        "/api/activo/activoFijo"(resources: 'activoFijo', excludes:['create', 'edit','patch'])

        "/"(controller: 'application', action:'index')
        "/api/session"(controller: 'application', action: 'session')
        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
