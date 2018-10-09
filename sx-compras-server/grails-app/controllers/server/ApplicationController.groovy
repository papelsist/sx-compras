package server

import grails.compiler.GrailsCompileStatic
import grails.core.GrailsApplication
import grails.plugin.springsecurity.annotation.Secured
import grails.plugins.*

@GrailsCompileStatic
class ApplicationController implements PluginManagerAware {

    GrailsApplication grailsApplication
    GrailsPluginManager pluginManager

    def index() {
        [grailsApplication: grailsApplication, pluginManager: pluginManager]
    }

    @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
    def session() {
        Map res = [:]

        Map info = [:]
        info.version = grailsApplication.metadata.getApplicationVersion()
        info.name = grailsApplication.metadata.getApplicationName()
        info.grailsVersion = grailsApplication.metadata.getGrailsVersion()
        info.environment = grailsApplication.metadata.getEnvironment()
        res.apiInfo = info

        if (isLoggedIn()) {
            res.user = getAuthenticatedUser()
        }
        respond res


    }
}
