package sx.bi


import grails.databinding.BindingFormat
import grails.plugin.springsecurity.annotation.Secured



//@Secured("ROLE_COMPRAS_USER")
class BiController {

    VentaNetaService VentaNetaService

    def ventaNetaAcumulada(VentaAcumuladaCommand command){

        def ventas=VentaNetaService.ventaNetaAcumulada(command)  
        respond ventas

    }

    def ventaNetaMensual(VentaAcumuladaCommand command){

        def ventas=VentaNetaService.ventaNetaMensual(command)  
        respond ventas

    }

    def movimientoCosteado(VentaAcumuladaCommand  command,String id){

        def movimientos=VentaNetaService.movimientoCosteado(command,id)  
        respond movimientos

    }

    def movimientoCosteadoDet(VentaAcumuladaCommand  command,String id,String clave){

        def movimientos=VentaNetaService.movimientoCosteadoDet(command,id,clave)  
        respond movimientos

    }

}

class VentaAcumuladaCommand{

    String clasificacion

    String tipoVenta

    String tipo

    @BindingFormat('yyyy-MM-dd')
    Date fechaInicial

    @BindingFormat('yyyy-MM-dd')
    Date fechaFinal

    String toString(){
        return "$clasificacion $tipoVenta $tipo"  
    }

    static constraints = {
        tipo nullable:true
    }

}