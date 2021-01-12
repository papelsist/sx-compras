package sx.sat


import groovy.transform.CompileStatic
import lx.econta.Mes

@CompileStatic
trait EcontaSupport extends SqlSupport {


    List readData(EcontaEmpresa emp, String query, ...params) {
        return getRows(
                getRawSql(emp.dataBaseUrl, emp.username, emp.password),
                query,
                params)
    }

    List readData(EcontaEmpresa emp, String query) {
        return getRows(
                getRawSql(emp.dataBaseUrl, emp.username, emp.password),
                query   )
    }



    Mes getMes(Integer v) {
        switch (v) {
            case 1:
                return Mes.ENERO
            case 2:
                return Mes.FEBRERO
            case 3:
                return Mes.MARZO
            case 4:
                return Mes.ABRIL
            case 5:
                return Mes.MAYO
            case 6:
                return Mes.JUNIO
            case 7:
                return Mes.JULIO
            case 8:
                return Mes.AGOSTO
            case 9:
                return Mes.SEPTIEMBRE
            case 10:
                return Mes.OCTUBRE
            case 11:
                return Mes.NOVIEMBRE
            case 12:
                return Mes.DICIEMBRE
            case 13:
                return Mes.TRECE
        }
    }

}