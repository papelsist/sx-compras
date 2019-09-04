package sx.logistica


import grails.rest.*
import grails.converters.*
import grails.plugin.springsecurity.annotation.Secured

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class SolicitudCambioController {
	static responseFormats = ['json']
	
    def index() { }

    def list(){
        println "Buscando Solicitudes..."
        def elements = SolicitudCambio.findAll("from SolicitudCambio where date(fecha) between date(?) and  date(?)",[params.periodo.fechaInicial, params.periodo.fechaFinal])
        println elements
        respond elements 
    }

    def solicitud(SolicitudCambio id) {
        println "Buscando solicitud..."
        def sol = id
        respond sol  
    }

    def autorizacionList() {

        println "Buscando solicitudes para autorizar..."

        println params.username

        def permisos = PermisoAutorizacion.findAllByUsername(params.username)
       
         def modulos =''
         def i=0
        permisos.each{
            i+= 1
            println it.modulo +"  "+ i +"  "+permisos.size()

            if(i != permisos.size()){
                modulos = modulos+"'${it.modulo}',"
            }else{
                modulos = modulos+"'${it.modulo}'"
            }     
        }

        if(permisos){
             def query = "from SolicitudCambio where modulo in (@MODULOS) and date(fecha) between date(?) and  date(?)".replaceAll('@MODULOS',modulos)
            def solicitudes = SolicitudCambio.findAll(query ,[params.periodo.fechaInicial, params.periodo.fechaFinal])

            println "Modulos: "+ modulos
            println solicitudes
             
            respond solicitudes
        }

        return []
           
        
    }
    def atencionList() {

    }
    
}
