package sx.costos

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.transaction.NotTransactional
import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang.exception.ExceptionUtils

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import sx.core.Inventario
import sx.core.Producto
import sx.utils.Periodo

import javax.sql.DataSource
import java.sql.SQLException

@Transactional
// @GrailsCompileStatic
@Slf4j
class CostoPromedioService {

    @Autowired
    @Qualifier('dataSource')
    DataSource dataSource

    def generar(Integer ejercicio , Integer mes) {
        PeriodoDeCosteo per = new PeriodoDeCosteo(ejercicio, mes)
        log.info('Generando registros de costo promedio  para {} ', per)
        PeriodoDeCosteo anterior = per.getPeriodoAnterior()
        List<CostoPromedio> costos = []
        CostoPromedio.where {ejercicio == anterior.ejercicio && mes == anterior.mes}.list().each {
            CostoPromedio cp = CostoPromedio.findOrSaveWhere(ejercicio: per.ejercicio, mes: per.mes, producto: it.producto)
            cp.costo = it.costo
            cp.costoAnterior = it.costo
            cp.clave = it.clave
            cp.descripcion = it.descripcion
            cp.save failOnError: true
            costos << cp
        }
        return costos
    }

    @NotTransactional
    def calcular(Integer ejercicio , Integer mes) {
        List<CostoPromedio> costos = CostoPromedio.where {ejercicio == ejercicio && mes == mes}.list()
        log.info('Registros de costo promedio generados: {}', costos.size())

        String sql ="""
            SELECT A.clave ,round(ifnull(SUM(a.IMP_COSTO)/SUM(A.CANT),0),2) AS costop
            FROM (
            SELECT 'EXI' as tipo,p.clave
            ,SUM(x.existencia_inicial/(case when p.unidad ='MIL' then 1000 else 1 end)) AS CANT,SUM(x.existencia_inicial/(case when p.unidad ='MIL' then 1000 else 1 end)*COSTO) AS IMP_COSTO 
            FROM existencia x JOIN PRODUCTO P ON(X.producto_id=P.ID) WHERE anio=? and mes=? and p.de_linea is true and p.inventariable is true and existencia_inicial<>0
            group by clave
            union
            SELECT 'INV' as tipo,P.clave
            ,SUM(CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)) AS CANT,SUM(CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*COSTO) AS IMP_COSTO
             FROM INVENTARIO X JOIN PRODUCTO P ON(X.producto_id=P.ID) 
             WHERE year(x.fecha)=(?) and month(x.fecha)=(?) and x.tipo in('TRS','REC','COM')  and p.de_linea is true and p.inventariable is true
             GROUP BY P.CLAVE
             ) AS A
             GROUP BY A.CLAVE
        """
        List<CostoPromedio> res = []
        getLocalRows(sql, [ejercicio, mes, ejercicio, mes]).each { row ->
            log.info('Procesando: {}', row)
            CostoPromedio cp = costos.find { it.clave == row.clave}
            if(!cp) {
                Producto producto = Producto.findByClave(row.clave)
                cp = new CostoPromedio(ejercicio: ejercicio, mes: mes, producto: producto)
                cp.clave = producto.clave
                cp.descripcion = producto.descripcion
                cp.costoAnterior = 0.0
            }
            cp.costo = row.costop
            cp.save flush: true
            res << cp
        }
        return res
    }




    def aplicar(Integer ejercicio , Integer mes) {
        Periodo periodo = Periodo.getPeriodoEnUnMes(mes - 1, ejercicio)
        List<CostoPromedio> costos = CostoPromedio.where{ejercicio == ejercicio && mes == mes}.list()
        costos.each {
            aplicarCosto(it, periodo)
        }

    }

    def aplicarCosto(CostoPromedio costoPromedio, Periodo periodo) {
        Inventario.executeUpdate(
                "update Inventario set costoPromedio = ? where producto = ? and fecha between ? and ? ",
                [periodo.fechaInicial, periodo.fechaFinal, costoPromedio.producto])
    }

    /**
     * Traslada el costo promedio a la tabla de existencias
     *
     * @param ejercicio
     * @param mes
     * @return
     */
    int trasladarCostoExistencias(Integer ejercicio, Integer mes) {
        String sql = """ 
                UPDATE EXISTENCIA E 
                SET COSTO_PROMEDIO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = E.ANIO AND C.MES = E.MES AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE E.ANIO = ? AND E.MES = ? 
                """
        return executeUdate(sql, [ejercicio, mes])
    }

    def costearInventario(Integer ejercicio, Integer mes) {
        String sql = """ 
                UPDATE INVENTARIO E 
                SET COSTO_PROMEDIO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = ? AND C.MES = ? AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE year(E.FECHA) = ? AND month(E.FECHA) = ? 
                """
        return executeUdate(sql, [ejercicio, mes, ejercicio, mes])
    }

    /**
     * Asigna el costo unitario de la existencia, tomandolo del costo promedio del mes anterior
     *
     * @param ejercicio
     * @param mes
     * @return
     */
    int asignarCostoInicialExistencias(Integer ejercicio, Integer mes) {
        Integer ejercicioAnterior = ejercicio
        Integer mesAnterior = mes
        if(mes == 1) {
            ejercicioAnterior = ejercicio - 1
            mesAnterior = 12
        }
        String sql = """ 
                UPDATE EXISTENCIA E 
                SET COSTO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = ? AND C.MES = ? AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE E.ANIO = ? AND E.MES = ? 
                """
        return executeUdate(sql, [ejercicioAnterior, mesAnterior, ejercicio, mes])
    }



    int executeUdate(String sql, List params) {
        Sql db = getLocalSql()
        try {
            return db.executeUpdate(sql, params)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    def getLocalRows(String sql, List params) {
        def db = getLocalSql()
        try {
            return db.rows(sql, params)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }



    Sql getLocalSql(){
        Sql sql = new Sql(this.dataSource)
        return sql
    }


}

class PeriodoDeCosteo {
    Integer ejercicio
    Integer mes
    PeriodoDeCosteo anterior

    PeriodoDeCosteo(Integer ejercicio, Integer mes) {
        this.ejercicio = ejercicio
        this.mes = mes
    }

    PeriodoDeCosteo getPeriodoAnterior() {
        if(anterior == null) {
            Integer ejercicioAnterior = ejercicio
            Integer mesAnterior = mes
            if(mes == 1) {
                ejercicioAnterior = ejercicio - 1
                mesAnterior = 12
            }
            anterior = new PeriodoDeCosteo(ejercicioAnterior, mesAnterior)
        }
        return anterior
    }

    String toString() {
        return "${ejercicio} - ${mes}"
    }

}
