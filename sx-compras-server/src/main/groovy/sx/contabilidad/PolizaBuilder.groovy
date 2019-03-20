package sx.contabilidad

import groovy.transform.builder.Builder
import groovy.transform.builder.ExternalStrategy

@Builder(builderStrategy = ExternalStrategy, forClass = Poliza, includes = 'ejercicio,mes,tipo,subtipo,fecha')
class PolizaBuilder {
}
