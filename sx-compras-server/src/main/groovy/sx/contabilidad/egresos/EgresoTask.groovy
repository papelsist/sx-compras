package sx.contabilidad.egresos


import sx.cxp.CuentaPorPagar
import sx.tesoreria.MovimientoDeCuenta

 trait EgresoTask {

     void buildComprobanteNacional(CuentaPorPagar cxp, MovimientoDeCuenta egreso, Map row) {
         row.descripcion = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                 " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                 " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"
         row.documento =  cxp.folio
         row.documentoFecha =  cxp.fecha
         row.uuid = cxp.uuid
         row.rfc = cxp.proveedor.rfc
         row.beneficiario = cxp.proveedor.nombre
         row.montoTotal = cxp.total
         row.moneda = cxp.moneda
         row.tc =  cxp.tipoDeCambio ? cxp.tipoDeCambio : 1.0

     }



     void buildComplementoDePago(Map det, MovimientoDeCuenta egreso) {
         det.montoTotalPago = egreso.importe.abs()
         det.metodoDePago = getMetodoDePago(egreso)
         det.beneficiario = egreso.afavor
         det.bancoOrigen = egreso.cuenta.bancoSat.clave
         det.ctaOrigen = egreso.cuenta.numero
         // det.bancoDestino = row.bancoDestino
         // det.ctaDestino = row.ctaDestino
         det.referenciaBancaria = egreso.referencia
         det.moneda = egreso.moneda.currencyCode
         det.tipCamb = egreso.tipoDeCambio ? egreso.tipoDeCambio : 1.0

     }

     Map buildDataRow(MovimientoDeCuenta egreso) {
         Map row = [
                 asiento: "${egreso.tipo}",
                 referencia: egreso.afavor,
                 referencia2: egreso.cuenta.descripcion,
                 origen: egreso.id,
                 documento: egreso.referencia,
                 documentoTipo: 'MovimientoDeCuenta',
                 documentoFecha: egreso.fecha,
                 sucursal: egreso.sucursal?: 'OFICINAS',
         ]
         row.descripcion = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "
         return row
     }

     String buildCuentaDeBanco(MovimientoDeCuenta egreso) {
         return "102-${egreso.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${egreso.cuenta.subCuentaOperativa}-0000"
     }

     String getMetodoDePago(MovimientoDeCuenta egreso) {
         switch (egreso.formaDePago) {
             case 'EFECTIVO':
                 return '01'
             case 'CHEQUE':
                 return '02'
             case 'TRANSFERENCIA':
                 return '03'
             case 'TARJETA_CREDITO':
                 return '04'
             default:
                 return '99'
         }
     }


}
