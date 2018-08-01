package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.plugin.springsecurity.SpringSecurityService
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

@Slf4j
@GrailsCompileStatic
@Service(Producto)
abstract  class ProductoService {

    @Autowired
    @Qualifier('springSecurityService')
    SpringSecurityService springSecurityService


    abstract Producto save(Producto prod)



}
