package sx.contabilidad


enum Mapeo {

    IvaNoTrasladadoVentas("209-0001-0000-0000")

    private final String clave


    public Mapeo(String id) {
        this.clave = id
    }

    String getClave() {
        return this.clave
    }
}

