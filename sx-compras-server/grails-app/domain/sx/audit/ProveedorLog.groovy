package sx.audit

class ProveedorLog {

    String event
    String proveedorId
    Date replicado

    static constraints = {
        event nullable: false, blank: false
        proveedorId nullable: false
        replicado nullable: true
    }

}
