package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@GrailsCompileStatic
@Slf4j
class ProductoService {

    def save(Producto producto) {
        producto.save failOnError: true, flush: true
    }
}
