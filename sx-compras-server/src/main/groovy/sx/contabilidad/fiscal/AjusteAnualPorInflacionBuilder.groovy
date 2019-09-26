package sx.contabilidad.fiscal

import java.sql.SQLException

import groovy.transform.Canonical

import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils


import org.springframework.stereotype.Component

import sx.contabilidad.SqlAccess
import sx.contabilidad.CuentaContable

@Slf4j
@Component
class AjusteAnualPorInflacionBuilder implements  SqlAccess{

    // @Autowired
    // @Qualifier('dataSource')
    // def dataSource

    Map grupos

    Map getGrupos() {
        if(grupos == null) {
            buildGrupos()
        }
        return grupos;
    }


    public buildGrupod() {
        
        def rows = [
            // BANCOS
            AjustePorInflacion('102-0001-0003-0000', 'BBVA BANCOMER CTA 1166228100', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('102-0001-0001-0000', 'BANAMEX CTA 1858193', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('102-0001-0006-0000', 'HSBC CTA 4019118074', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('102-0001-0002-0000', 'SCOTIABANK CTA 00001691945', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('102-0001-0004-0000', 'SANTANDER SERFIN CTA 65-50219406-7', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('102-0001-0005-0000', 'IXE BANCO SA 1666987-8', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('', 'UBS AG CTO 406546', 'SISTEMA FINANCIERO', 'BANCOS'),
            AjustePorInflacion('102-0001-0007-0000', 'INTERACCIONES CASA DE BOLSA', 'SISTEMA FINANCIERO', 'BANCOS'),
            // INVERSIONES
            AjustePorInflacion('102-0001-0-0000', '', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            AjustePorInflacion('102-0001-0-0000', '', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            AjustePorInflacion('102-0001-0-0000', '', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            AjustePorInflacion('102-0001-0-0000', '', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            AjustePorInflacion('102-0001-0-0000', '', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            AjustePorInflacion('102-0001-0-0000', '', 'SISTEMA FINANCIERO', 'INVERSIONES'),
            // 
        ]
    }


    
    
}

@Canonical
class AjustePorInflacion {
    String cuenta
    String concepto
    String tipo
    String grupo
}
