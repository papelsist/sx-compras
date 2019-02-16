package sx.contabilidad

/**
 * Trait para simplificar la generacion de asientos contables, util en la generacion de polizas
 * y partiendo de la primisa de que los asientos deben ir cuadrados es decir los Debe - Haber == 0
 *
 */
abstract trait AsientoBuilder implements  SqlAccess{

    /**
     * Metodo a implementar por el asiento requerido
     *
     * @param Poliza
     * @return
     */
    abstract generarAsientos(Poliza poliza, Map params)

    PolizaDet buildRegistro(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.cliente,
                referencia2: row.cliente,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.factura,
                documentoTipo: row.tipo,
                documentoFecha: row.fecha_fac,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        asignarComprobanteNacional(det, row)
        asignarComplementoDePago(det, row)
        return det
    }

    /**
     * Asigna las propiedades relacionadas con el comprobante nacional
     *
     * @param det El registro de PolizaDet
     * @param row El objeto con las propiedades
     */
    void asignarComprobanteNacional(PolizaDet det, def row) {
        det.uuid = row.uuid
        det.rfc = row.rfc
        det.montoTotal = row.montoTotal
        det.moneda = row.moneda
        det.tipCamb = row.tc
    }

    /**
     * Asigna las propiedades relacionadas con el metodo de pago
     * para ser usadas en la generacion del complemento de pago del
     * SAT
     *
     * @param det
     * @param row
     */
    void asignarComplementoDePago(PolizaDet det, def row) {
        det.metodoDePago = row.metodoDePago
        det.beneficiario = row.beneficiario
        det.bancoOrigen = row.bancoOrigen
        det.bancoDestino = row.bancoDestino
        det.ctaOrigen = row.ctaOrigen
        det.ctaDestino = row.ctaDestino
        det.referenciaBancaria = row.referenciaBancaria
        if(det.metodoDePago != '01') {
            if(det.ctaOrigen == null) {
                det.metodoDePago = '99'
            }
        }

    }

    /**
     * Utility method para econtrar una cuenta contable por clave
     *
     * @param clave
     * @return
     */
    CuentaContable buscarCuenta(String clave) {
        CuentaContable cuenta = CuentaContable.where{clave == clave}.find()
        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable ${clave}")
        return cuenta
    }

    /**
     * Utility method para generar fechas
     *
     * @param date
     * @return
     */
    String toSqlDate(Date date){
        return date.format('yyyy-MM-dd')
    }

    /**
     * Genera una descripcion uniforme para todo el asiento
     * la implementacion por defualt regresa el valor: 'DESCRIPCION PENDIENTE'
     *
     * @param row El objeto base para obtener la descripcion
     *
     * @return
     */
    String generarDescripcion(Map row) {
        return 'DESCRIPCION PENDIENTE'
    }

}