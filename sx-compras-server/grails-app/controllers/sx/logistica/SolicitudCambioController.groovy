package sx.logistica


import grails.rest.*
import grails.converters.*
import grails.plugin.springsecurity.annotation.Secured
import sx.security.User
import sx.audit.Audit

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

        def permisos = PermisoAutorizacion.findAllByUsername(params.username)
       
         def modulos =''
         def i=0
        permisos.each{
            i+= 1

            if(i != permisos.size()){
                modulos = modulos+"'${it.modulo}',"
            }else{
                modulos = modulos+"'${it.modulo}'"
            }     
        }

        if(permisos){
            def query = "from SolicitudCambio where modulo in (@MODULOS) and date(fecha) between date(?) and  date(?) and estado = 'PENDIENTE' ".replaceAll('@MODULOS',modulos)
            def solicitudes = SolicitudCambio.findAll(query ,[params.periodo.fechaInicial, params.periodo.fechaFinal])

            println "Modulos: "+ modulos
            println solicitudes
             
            respond solicitudes
        }

        return []
           
        
    }
    def atencionList() {
        println "Buscando Solicitudes..."
        def elements = SolicitudCambio.findAll("from SolicitudCambio where date(fecha) between date(?) and  date(?) and estado <> 'PENDIENTE'",[params.periodo.fechaInicial, params.periodo.fechaFinal])
        println elements
        respond elements 

    }

    def actualizar() {
        println "Actualizando params"
        println params

        SolicitudCambio sol = SolicitudCambio.get(params.sol)
        def user = User.findByUsername(params.user)
        // bindData sol, getObjectToBind()

        def solJson =  request.JSON
        println solJson

        if(params.tipo == 'autorizacion'){
            println sol
            println user    
            sol.autorizo = user
            sol.estado = params.estado
            sol.autorizacion = new Date()
            sol.comentarioAutorizacion = solJson.comentarioAutorizacion
        }
        
        if(params.tipo == 'atencion'){
           // println sol
           // println user    
            sol.atendio = user
            sol.estado = params.estado
            sol.atencion = new Date()
            sol.comentarioAtencion = solJson.comentarioAtencion
        }

        def audit = new Audit();

        audit.persistedObjectId = sol.id
        audit.target = sol.sucursal.nombre
        audit.name = 'SolicitudCambio'
        audit.tableName = 'solicitud_cambio'
        audit.source = 'OFICINAS'
        audit.eventName = 'UPDATE'

        audit.save(failOnError: true, flush:true)

         sol.save failOnError:true, flush:true

        return []
    }
}
