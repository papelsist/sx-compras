package sx.costos

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.transaction.NotTransactional
import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang.exception.ExceptionUtils

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import sx.core.Existencia
import sx.core.Inventario
import sx.core.Producto
import sx.inventario.Transformacion
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
        PeriodoDeCosteo anterior = per.getPeriodoAnterior()
        List<CostoPromedio> costos = []
        List<CostoPromedio> anteriores = CostoPromedio.where {ejercicio == anterior.ejercicio && mes == anterior.mes}.list()
        log.info('Trasladando  {} registros de costo promedio del period anterior: {} al {}', anteriores.size(), anterior, per)

        anteriores.each {
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

    def costearExistenciaInicial(Integer ejercicio, Integer mes) {
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
        executeUdate(sql, [ejercicioAnterior, mesAnterior, ejercicio, mes])
    }


    def costearTransformaciones(Integer ejercicio , Integer mes) {
        PeriodoDeCosteo per = new PeriodoDeCosteo(ejercicio, mes)
        PeriodoDeCosteo anterior = per.getPeriodoAnterior()
        Periodo periodo = Periodo.getPeriodoEnUnMes(mes - 1, ejercicio)

        def trs = Transformacion.where{ fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal }
        log.debug("Costeando {} registros de transformaciones para el periodo {} ", trs.size(), periodo)
        trs.each {
            def costo = null
            it.partidas.each { tr ->
                if(tr.cantidad < 0) {
                    CostoPromedio cp = CostoPromedio.where{ejercicio == anterior.ejercicio && mes == anterior.mes && producto == tr.producto}.find()
                    if(cp){
                        costo = cp.costo
                        // log "Salida  ${tr.producto.clave} Cantidad: ${tr.cantidad} CostoU: ${costo} (sw2:${tr.sw2})"
                    } else {
                        log.error("Error no se enctontro Costo promedio en el periodo anterior...")
                        costo = null
                    }

                } else {
                    if(costo) {
                        try {
                            Inventario iv = tr.inventario
                            iv.costo = costo
                            iv.save flush: true
                            // println " Entrada costeada ${tr.producto.clave}  Cantidad:${tr.cantidad}  CostoU: ${costo}(sw2:${tr.sw2})"
                        }catch(Exception ex) {
                            log.error("Error costeando  ${it.tipo} ${it.documento} {}", ex.message)
                        }
                    }

                }

            }
        }

    }

    @NotTransactional
    def calcular(Integer ejercicio , Integer mes) {
        List<CostoPromedio> costos = CostoPromedio.where {ejercicio == ejercicio && mes == mes}.list()
        log.info('Actualizando costo a {} registros de costo promedio para el periodo {} - {}', costos.size(), mes, ejercicio)

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
        List<CostoPromedio> actualizados = []
        getLocalRows(sql, [ejercicio, mes, ejercicio, mes]).each { row ->
            CostoPromedio cp = costos.find { it.clave == row.clave}
            if(!cp) {
                Producto producto = Producto.findByClave(row.clave)
                cp = new CostoPromedio(ejercicio: ejercicio, mes: mes, producto: producto)
                cp.clave = producto.clave
                cp.descripcion = producto.descripcion
                cp.costoAnterior = 0.0
                costos << cp
            }
            cp.costo = row.costop
            cp.save flush: true
            actualizados << cp
        }
        log.debug("{} Registros actualizados ", actualizados.size())
        return costos
    }

    def aplicar(Integer ejercicio, Integer mes) {
        costearExistencias(ejercicio, mes)
        costearInventario(ejercicio, mes)
    }


    /**
     * Traslada el costo promedio a la tabla de existencias
     *
     * @param ejercicio
     * @param mes
     * @return
     */
    def costearExistencias(Integer ejercicio, Integer mes) {
        String sql = """ 
                UPDATE EXISTENCIA E 
                SET COSTO_PROMEDIO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = E.ANIO AND C.MES = E.MES AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE E.ANIO = ? AND E.MES = ? 
                """
        executeUdate(sql, [ejercicio, mes])
    }

    def costearInventario(Integer ejercicio, Integer mes) {
        String sql = """ 
                UPDATE INVENTARIO E 
                SET COSTO_PROMEDIO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = ? AND C.MES = ? AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE year(E.FECHA) = ? AND month(E.FECHA) = ? 
                """
        executeUdate(sql, [ejercicio, mes, ejercicio, mes])
    }

    def analisisDeCosto(CostoPromedio cp) {
        def movimientos = Inventario.findAll("""
                from Inventario i 
                where i.producto = ? and year(fecha)= ? and month(fecha) = ? and tipo in('COM', 'TRS', 'REC')
                """, [cp.producto, cp.ejercicio, cp.mes])
        def existencias =  Existencia.findAll("from Existencia e where e.producto = ? and e.anio = ? and e.mes = ?",
                [cp.producto, cp.ejercicio, cp.mes])

        return rows
    }



    def executeUdate(String sql, List params) {
        Sql db = getLocalSql()
        try {
            db.executeUpdate(sql, params)
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
        Integer ejercicioAnterior = ejercicio
        Integer mesAnterior = mes - 1
        if(mes == 1) {
            ejercicioAnterior = ejercicio - 1
            mesAnterior = 12
        }
        return new PeriodoDeCosteo(ejercicioAnterior, mesAnterior)
    }

    String toString() {
        return "${ejercicio} - ${mes}"
    }

}

class AnalisisDeCosto {

    Integer ejercicio
    Integer mes
    String clave
    String descripcion
    BigDecimal inventarioInicial
    BigDecimal costoInicial

    List<Inventario> movimientos
    BigDecimal inventarioFinal
    BigDecimal costoFinal

    AnalisisDeCosto(CostoPromedio cp, List<Inventario> movimientos, List<Existencia> existencias ) {
        this.ejercicio = cp.ejercicio
        this.mes = cp.mes
        this.clave = cp.clave
        this.descripcion = cp.descripcion
        this.movimientos = movimientos
        calcularInentarioInicial(existencias)
    }


    void calcularInentarioInicial(List<Existencia> existencias) {
        this.costoInicial =  existencias.sum 0.0, { Existencia it ->
            def factor = it.producto.unidad == 'MIL' ? 1000 : 1
            return it.cantidad/factor * it.costo
        }
        this.inventarioInicial = existencias.sum 0.0, { it -> it.cantidad}
    }

    void calcilarCosto() {
        this.inventarioFinal =  this.movimientos.sum 0.0, { Inventario it ->
            def factor = it.producto.unidad == 'MIL' ? 1000 : 1
            return it.cantidad/factor * it.costo
        }
    }



}
