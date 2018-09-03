package sx.core

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.converters.*

@Secured("permitAll")
class AppConfigController extends RestfulController {
    static responseFormats = ['json']
    AppConfigController() {
        super(AppConfig)
    }
}
