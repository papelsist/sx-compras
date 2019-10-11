package sx.logistica

class PermisoAutorizacion {

    String id

    String username

    String modulo

    static constraints = {
        modulo inList:['CLIENTES','COBRANZA','INVENTARIOS','EMBARQUES','DEPOSITOS','USUARIOS','TRASLADOS','VENTAS','PEDIDOS','CAJA','COMPRAS','CREDITO']
    }

    static mapping ={
        id generator: 'uuid'
    }
}
