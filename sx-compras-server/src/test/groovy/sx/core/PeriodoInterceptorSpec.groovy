package sx.core

import grails.testing.web.interceptor.InterceptorUnitTest
import spock.lang.Specification

class PeriodoInterceptorSpec extends Specification implements InterceptorUnitTest<PeriodoInterceptor> {

    def setup() {
    }

    def cleanup() {

    }

    void "Test periodo interceptor matching"() {
        when:"A request matches the interceptor"
        withRequest(controller:"periodo")

        then:"The interceptor does match"
        interceptor.doesMatch()
    }
}
