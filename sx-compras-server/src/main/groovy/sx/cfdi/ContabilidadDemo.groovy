package sx.cfdi

import groovy.xml.MarkupBuilder

class ContabilidadDemo {

    def generarCatalogo() {
        def xmlWriter = new StringWriter()
        def mb = new MarkupBuilder(xmlWriter)
        mb.'x:movies'('xmlns:x':'http://www.groovy-lang.org') {
            (1..3).each { n ->
                'x:movie'(id: n, "the godfather $n")
                if (n % 2 == 0) {
                    'x:movie'(id: n, "the godfather $n (Extended)")
                }
            }
        }

    }
}
