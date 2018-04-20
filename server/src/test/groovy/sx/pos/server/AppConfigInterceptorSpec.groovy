package sx.pos.server

import grails.testing.web.interceptor.InterceptorUnitTest
import spock.lang.Specification


class AppConfigInterceptorSpec extends Specification implements InterceptorUnitTest<AppConfigInterceptor> {

    def setup() {
    }

    def cleanup() {

    }

    void "Test operacionConSucursal interceptor matching"() {
        when:"A request matches the interceptor"
        withRequest(controller:"operacionConSucursal")

        then:"The interceptor does match"
        interceptor.doesMatch()
    }
}
