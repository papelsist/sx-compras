package sx.contabilidad

/**
 * Enumeracion de metodos de pago
 */
enum SatMetotoDePago {
    BONIFICACION('17'),
    CHEQUE('02'),
    DEPOSITO_CHEQUE('02'),
    DEPOSITO_EFECTIVO('01'),
    DEPOSITO_MIXTO('01'),
    EFECTIVO('01'),
    TARJETA_CREDITO('04'),
    TARJETA_DEBITO('99'),
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