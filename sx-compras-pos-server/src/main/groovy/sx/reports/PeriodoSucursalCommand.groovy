package sx.reports

import groovy.transform.ToString


@ToString(includeFields = true)
class SucursalPeriodoCommand implements grails.validation.Validateable{
    Date fechaIni
    Date fechaFin
    String sucursal

    Map toReportMap() {
        return [FECHA_INI: fechaIni, FECHA_FIN: fechaFin, SUCURSAL: sucursal?: '%']
    }
}
