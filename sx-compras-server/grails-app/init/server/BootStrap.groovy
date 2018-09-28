package server

import grails.compiler.GrailsCompileStatic
import grails.util.Environment
import groovy.transform.CompileStatic
import sx.security.*

@GrailsCompileStatic
class BootStrap {

    def init = { servletContext ->
        if(Environment.DEVELOPMENT) {
            Role userRole=Role.findOrSaveWhere(authority:'ROLE_USER')
            Role adminRole=Role.findOrSaveWhere(authority:'ROLE_ADMIN')



            User admin=User.findByUsername('admin')
            if(!admin){
                admin=new User(username:'admin'
                        ,password:'admin'
                        ,apellidoPaterno:'admin'
                        ,apellidoMaterno:'admin'
                        ,nombres:'admin'
                        ,nombre:' ADMIN ADMIN'
                        ,numeroDeEmpleado:'0000')
                        .save(flush:true,failOnError:true)
                UserRole.create(admin,userRole,true)
                UserRole.create(admin,adminRole,true)
            }

            Role comprasRole=Role.findOrSaveWhere(authority:'ROLE_COMPRAS')
            if(!UserRole.exists(admin.id, comprasRole.id)) {
                UserRole.create(admin, comprasRole)
            }

            Role costosRole = Role.findOrSaveWhere(authority:'ROLE_COSTOS_MANAGER')
            if(!UserRole.exists(admin.id, costosRole.id)) {
                UserRole.create(admin, costosRole)
            }

            Role gastos = Role.findOrSaveWhere(authority:'ROLE_GASTOS')
            if(!UserRole.exists(admin.id, gastos.id)) {
                UserRole.create(admin, gastos)
            }

        }
    }
    def destroy = {
    }
}
