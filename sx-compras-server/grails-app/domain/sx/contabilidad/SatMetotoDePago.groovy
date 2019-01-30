package sx.contabilidad

enum SatMetotoDePago {
    BONIFICACION('17'),
    CHEQUE('02'),
    DEPOSITO(),
    DEPOSITO_CHEQUE(),
    DEPOSITO_EFECTIVO(),
    DEPOSITO_MIXTO(),
    DEVOLUCION(),
    EFECTIVO('01'),
    PAGI_DIF(),
    PAGO_DIF(),
    TARJETA(),
    TARJETA_CREDITO(),
    TARJETA_DEBITO(),
    TRANSFERENCIA('03'),

    private String value

    SatMetotoDePago(String value) {
        this.value = value
    }

    String getValue() {
        return this.value
    }


    String toString() {
        return "${name()} (${value})"
    }


}