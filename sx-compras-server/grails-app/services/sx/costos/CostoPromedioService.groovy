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
import sx.inventario.TransformacionDet
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
        log.info('Se terminaron de trasladar los costos iniciales')
        return costos
    }

    def costearExistenciaInicial(Integer ejercicio, Integer mes) {
        log.info('Calculando el costo inicial de la existencia {} - {}', ejercicio, mes)
        Integer ejercicioAnterior = ejercicio
        Integer mesAnterior = mes - 1
        if(mes == 1) {
            ejercicioAnterior = ejercicio - 1
            mesAnterior = 12
        }
        log.info('Ejercicio anterior: {}-{}', ejercicioAnterior, mesAnterior)
        String sql = """ 
                UPDATE EXISTENCIA E JOIN PRODUCTO P ON(E.PRODUCTO_ID = P.ID)
                SET COSTO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = ? AND C.MES = ? AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE P.DE_LINEA IS TRUE AND E.ANIO = ? AND E.MES = ? 
                """
        executeUdate(sql, [ejercicioAnterior, mesAnterior, ejercicio, mes])
         log.info('Se termino de costear las existencia iniciales')
    }


    @NotTransactional
    def costearTransformaciones(Integer ejercicio , Integer mes) {
        log.info('Costeando transformaciones')
        PeriodoDeCosteo per = new PeriodoDeCosteo(ejercicio, mes)
        PeriodoDeCosteo anterior = per.getPeriodoAnterior()
        Periodo periodo = Periodo.getPeriodoEnUnMes(mes - 1, ejercicio)

        def rows = Transformacion.findAll(
                "from Transformacion t where date(t.fecha) between ? and ? ",
                [periodo.fechaInicial, periodo.fechaFinal])
        // log.debug("Costeando {} registros de transformaciones para el periodo {} ", rows.size(), periodo)
        rows.each { Transformacion trs ->
            
            costearTransformacion(trs, anterior)
        }
        log.info('Se termino de costear las Transformaciones')

    }

    def costearTransformacion(Transformacion trs, PeriodoDeCosteo anterior) {
        List<TransformacionDet> partidas = trs.partidas.sort{it.cantidad}.sort{it.sw2}
        def costo = 0
        def salida = 0
        def costoOrigen = 0
        partidas.each { tr ->

            def factor = tr.producto.unidad == 'MIL' ? 1000 : 1

            if(tr.cantidad < 0) {
                salida = tr.cantidad.abs()
                CostoPromedio cp = CostoPromedio.where{ejercicio == anterior.ejercicio && mes == anterior.mes && producto == tr.producto}.find()
                if(cp){
                    costo = cp.costo
                } else {
                    def existenciaAnt = Existencia.where{anio == anterior.ejercicio && mes == anterior.mes && producto == tr.producto && sucursal == trs.sucursal }.find()
                    if(existenciaAnt)
                        costo = existenciaAnt.costoPromedio
                }
                if(costo){
                    costoOrigen = salida / factor * costo
                }
            }else{
                if(costoOrigen){
                    def entrada = tr.cantidad.abs()
                    try {
                        Inventario iv = tr.inventario
                        if(iv) {
                            if(salida != entrada ) {
                                 costo = costoOrigen / (entrada / factor)
                            }
                            iv.costo = costo
                            iv.save failOnError: true, flush: true
                        }
                    }catch(Exception ex) {
                        ex.printStackTrace()
                    }
                }
            }
            /*
            if(tr.cantidad < 0) {
                salida = tr.cantidad.abs()
                // log.info("Salen : ${tr.producto.clave} ${tr.cantidad}   (sw2:${tr.sw2})" )
                CostoPromedio cp = CostoPromedio.where{ejercicio == anterior.ejercicio && mes == anterior.mes && producto == tr.producto}.find()
                if(cp){
                    costo = cp.costo
                  //  log.info("Costo anterior: {}", costo)
                } else {
               // log.error("Error no se enctontro Costo promedio en el periodo anterior...")
                    
                    def existenciaAnt = Existencia.where{anio == anterior.ejercicio && mes == anterior.mes && producto == tr.producto && sucursal == trs.sucursal }.find()
                //    log.info("Costo en existencia {}",existenciaAnt.costoPromedio)
                    if(existenciaAnt)
                        costo = existenciaAnt.costoPromedio

                }

            } else {
                if(costo) {
                  //  log.info("Entran: ${tr.producto.clave} ${tr.cantidad}  (sw2:${tr.sw2})" )
                    try {
                        Inventario iv = tr.inventario
                        if(iv) {
                            if(salida != tr.cantidad.abs()) {
                           //     log.info('Actualizando costo por diferencia de cantidades Salida: {} Entrada: {}', salida, tr.cantidad)
                                def factor = tr.producto.unidad == 'MIL' ? 1000 : 1
                                def importeCosto = (salida / factor ) * costo
                           //     log.info('Costo total de la salida (Importe costo: {})', importeCosto)
                                costo = (importeCosto /tr.cantidad) * factor
                            }
                          //  log.info('Costo por asignar:{} anteriormente: {}', costo, iv.costo)
                            iv.costo = costo
                            iv.save failOnError: true, flush: true
                        } else {
                           // log.info("TRS sin inventario {}", tr)
                        }
                    }catch(Exception ex) {
                        ex.printStackTrace()
                        //log.error("Error costeando  ${trs.tipo} ${trs.documento} {}", ex.message)
                    }
                }
            }
            */
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
            ,(case when SUM(x.existencia_inicial)>0 then SUM(x.existencia_inicial/(case when p.unidad ='MIL' then 1000 else 1 end)) else 0 end) AS CANT
            ,(case when SUM(x.existencia_inicial)>0 then SUM(x.existencia_inicial/(case when p.unidad ='MIL' then 1000 else 1 end)*COSTO) else 0 end) AS IMP_COSTO 
            FROM existencia x JOIN PRODUCTO P ON(X.producto_id=P.ID) WHERE anio=? and mes=? and p.de_linea is true and p.inventariable is true and existencia_inicial<>0
            group by clave
            union
            SELECT 'INV' as tipo,P.clave
            ,SUM(CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)) AS CANT,SUM(CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*(COSTO+GASTO)) AS IMP_COSTO
             FROM INVENTARIO X JOIN PRODUCTO P ON(X.producto_id=P.ID) 
             WHERE x.costo > 0 and year(x.fecha)=(?) and month(x.fecha)=(?) and x.tipo in('TRS','REC','COM', 'MAQ')  and x.cantidad > 0 and p.de_linea is true and p.inventariable is true
             GROUP BY P.CLAVE
             union
             SELECT 'INV' as tipo,P.clave
            ,SUM(CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)) AS CANT,SUM(CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*(COSTO+GASTO)) AS IMP_COSTO
             FROM INVENTARIO X JOIN PRODUCTO P ON(X.producto_id=P.ID) 
             WHERE x.costo > 0 and year(x.fecha)=(?) and month(x.fecha)=(?) and x.tipo in('DEC')  and p.de_linea is true and p.inventariable is true
             GROUP BY P.CLAVE
             ) AS A
             GROUP BY A.CLAVE
        """
        List<CostoPromedio> actualizados = []
        getLocalRows(sql, [ejercicio, mes, ejercicio, mes, ejercicio, mes]).each { row ->
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
            if(cp.costo == 0 && cp.costoAnterior > 0){
                cp.costo = cp.costoAnterior
            }
            cp.save flush: true
            actualizados << cp
        }
        // log.debug("{} Registros actualizados ", actualizados.size())
        log.info('Se termino de costear los productos')
        return costos
    }

    def aplicar(Integer ejercicio, Integer mes) {
        println "************Aplicando costos************"
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
    def costearExistenciaFinal(Integer ejercicio, Integer mes) {
        //log.debug("Costaeand el inventario final para {} - {}", mes, ejercicio)
        String sql = """ 
                UPDATE EXISTENCIA E JOIN PRODUCTO P ON(P.ID = E.PRODUCTO_ID)
                SET COSTO_PROMEDIO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = E.ANIO AND C.MES = E.MES AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE P.DE_LINEA IS TRUE AND E.ANIO = ? AND E.MES = ? 
                """
        executeUdate(sql, [ejercicio, mes])
    }

    def costearMovimientosDeInventario(Integer ejercicio, Integer mes) {
        //log.debug("Costeando los movimientos de  inventario  {} - {}", mes, ejercicio)
        String sql = """ 
                UPDATE INVENTARIO E JOIN PRODUCTO P ON(P.ID = E.PRODUCTO_ID)
                SET COSTO_PROMEDIO = IFNULL((SELECT C.COSTO FROM COSTO_PROMEDIO C WHERE C.EJERCICIO = ? AND C.MES = ? AND C.PRODUCTO_ID = E.PRODUCTO_ID ), 0)
                WHERE P.DE_LINEA IS TRUE AND year(E.FECHA) = ? AND month(E.FECHA) = ? 
                """
        executeUdate(sql, [ejercicio, mes, ejercicio, mes])
    }

    def actualizarMovimientosExistenciaSinCosto(Integer ejercicio, Integer mes) {
        def q = CostoPromedio.where{ejercicio == ejercicio && mes == mes && costo <= 0}
        q = q.where{costoAnterior > 0 }
        q.list().each {
           // log.info("${it.clave} ${it.costoAnterior} ${it.costo}")
            // Actualizar todos los movimientos
            Inventario.executeUpdate("update Inventario set costoPromedio = ? where year(fecha)=? and month(fecha)=? and producto =?", [it.costoAnterior, ejercicio, mes, it.producto])
            Existencia.executeUpdate("update Existencia set costoPromedio = ? where anio = ? and mes = ? and producto = ?", [it.costoAnterior, ejercicio, mes, it.producto])
        }
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

    void costeoMedidasEspeciales(Integer ejercicio, Integer mes){
        def query = """
                        select * from 
                        (
                            select p.id
                            from inventario i join producto p on (p.id = i.producto_id) 
                            where p.de_linea is false  and inventariable is true and month(i.fecha)=? and year(i.fecha) = ?
                            union
                            select p.id
                            from existencia e join producto p on (p.id = e.producto_id) 
                            where p.de_linea is false  and inventariable is true and e.cantidad <> 0 and e.mes= ? and anio=?
                        ) as x group by x.id
                    """
        def productos = getLocalRows(query,[mes, ejercicio, mes, ejercicio])
        productos.each{
            Producto producto = Producto.get(it.id)
            log.info("Calculando el costo para {} de medida",producto.clave)
            calcularPorProducto(ejercicio, mes, producto)
        }
        // log.info('Se terminaron de costear las medidas especiales')
    }

    void calcularPorProducto(Integer ejercicio, Integer mes,  Producto producto){

        println "Calculando por producto ---- ${producto} ----"

        costearTransformaciones(ejercicio,mes)
 
		def periodo = Periodo.getPeriodoEnUnMes(mes - 1 ,ejercicio)
    	
    	def ejercicioAnterior = ejercicio

		def mesAnterior = mes - 1
        if(mes == 1) {
            ejercicioAnterior = ejercicio - 1
            mesAnterior = 12
        }

    	def fechaIni = periodo.fechaInicial
         
        def fechaFin = periodo.fechaFinal
    
        def inventarios =Inventario.executeQuery("from Inventario i  where date(i.fecha) between ? and ? and i.producto = ? ",[fechaIni,fechaFin,producto])

		def existencias= Existencia.executeQuery("from Existencia e where e.producto= ? and mes = ? and anio= ? ",[producto,mes,ejercicio]) 
    	
        def existenciasAnt= Existencia.executeQuery("from Existencia e where e.producto= ? and mes = ? and anio= ? ",[producto,mesAnterior,ejercicioAnterior]) 
        
        //  Corriendo costo final anterior a inicial actual en existencia
    	def costoAnt = 0.00
    
    	def exisCostoAnt = existenciasAnt.find{it.costoPromedio != 0}
    
        if(exisCostoAnt){
			costoAnt = exisCostoAnt.costoPromedio
        }
    
        existencias.each{      
            it.costo  = costoAnt
            it.save flush:true
        }
    
      
        if(inventarios){

            def costoPromedio = 0.00
   
            def com = inventarios.find{it.tipo == 'COM'}
            
            def trs = inventarios.find{it.tipo == 'TRS' && it.cantidad >0 }
            
            def maq = inventarios.find{it.tipo == 'MAQ' && it.cantidad >0 }

            def rec = inventarios.find{it.tipo == 'REC' && it.cantidad >0 }

            def dec = inventarios.find{it.tipo == 'DEC' }

           
            
            if(!com && !trs && !rec && !maq && !dec) {
              //  No tiene entradas
                def row = existencias.find{it.costo != 0}

             	if(row){
                 	costoPromedio= row.costo
             	}

                if(!producto.deLinea){
                        //Es medida especial y voy a buscar una com que coincida
                    inventarios.each{ invent ->
                            
                        if(invent.tipo == 'FAC' ){
                            def comFound = Inventario.findByProductoAndTipoAndCantidad(invent.producto,'COM', -invent.cantidad)
                            if(comFound){
                                costoPromedio = comFound.costo + comFound.gasto
                            }
                        }
                    }
                        
                }
                        
            }else{
             //si tiene Entradas
             log.info("Si tiene entradas")
                def inventariosEnt =Inventario.executeQuery("""
                    from Inventario i  
                        where date(i.fecha) between ? and ? 
                        and i.producto = ? AND tipo in ('COM','TRS','REC','MAQ') 
                        and cantidad > 0 
                        and costo > 0 """,
                    [fechaIni,fechaFin,producto])

                def decs = Inventario.executeQuery("""
                    from Inventario i  
                        where date(i.fecha) between ? and ? 
                        and i.producto = ? AND tipo = 'DEC'
                        and costo > 0 """,
                    [fechaIni,fechaFin,producto])

                inventariosEnt.addAll(decs)
                
                if(inventariosEnt.size() >= 1 ){
                    
                    def existenciaInicial = existencias.sum{it.existenciaInicial}?:0.00
                    def existenciaCosto = existencias.find{ it.costo >0 }

                    def exisCosto = 0.00
                    if(existenciaCosto){
                        exisCosto = existenciaCosto.costo
                    }

                      if(existenciaInicial < 0){
                        existenciaInicial = 0.00
                        exisCosto = 0.00 
                    }

                    def movsTotal=inventariosEnt.sum{it.cantidad} ?: 0.00
                    
                    def cantidadTotal=existenciaInicial + movsTotal

                    def costoInicial= existenciaInicial * exisCosto

                    def costoTotal = inventariosEnt.sum{ it.cantidad * ( it.costo +  it.gasto )} + costoInicial

                    costoPromedio=costoTotal/cantidadTotal
                } 
            }
            
            if(costoPromedio){
                   //Aplicando costo promedio 
                    inventarios.each{invent ->
                        invent.costoPromedio=costoPromedio
                        invent.save flush:true
                    }  
                
                  if(producto.deLinea){
                          def cp= CostoPromedio.findByMesAndEjercicioAndProducto(mes,ejercicio,producto)
                          if(cp){
                              cp.costo=costoPromedio
                              cp.save flush:true    
                          }                       
                    }
                    
                    existencias.each{
                        it.costoPromedio  = costoPromedio 
                        it.save flush:true
                    }
                    
                }
            
        }else{
            /// Costeando sin movimientos
            def existenciaTotal= existencias.sum{it.cantidad}
             if(existenciaTotal){
                 existencias.each{exis ->
                  	if(exis.costo){
                      	exis.costoPromedio=exis.costo
                         exis.save flush:true
                     }
                 }
             }            
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


