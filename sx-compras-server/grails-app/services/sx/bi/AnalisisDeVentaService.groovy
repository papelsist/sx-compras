package sx.bi

import java.sql.SQLException

import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.apache.commons.lang.exception.ExceptionUtils


import sx.utils.Periodo

@Slf4j
class AnalisisDeVentaService {

  def dataSource

  def buildAnalisis(Periodo periodo) {
    String select = ventasQuery()
    // .replaceAll("@FECHA_INICIAL", periodo.fechaInicial.format('yyyy-MM-dd'))
    // .replaceAll("@FECHA_FINAL", periodo.fechaFinal.format('yyyy-MM-dd'))
    log.info('SELECT: {}', select)
    // return  []
    return leerRegistros(select, [FECHA_INICIAL: periodo.fechaInicial, FECHA_FINAL: periodo.fechaFinal])
  }

 
  def List leerRegistros(String sql, Map params){
    Sql db = getSql()
    try {
      return db.rows(sql,params)
    }catch (SQLException e){
      def c = ExceptionUtils.getRootCause(e)
      def message = ExceptionUtils.getRootCauseMessage(e)
      log.error(message, c)
      throw new RuntimeException(message,c)
    }finally {
        db.close()
    }
  }


  Sql getSql(){
    return new Sql(dataSource)
  }

  String ventasQuery() {
    return """
      SELECT a.clave,a.descripcion,a.grupo, a.linea,a.clase,a.marca,a.unidad,a.kgXmillar,a.gramos
      ,sum(a.cantidad) cantidad
      ,sum(case when sucursal='ANDRADE' then a.cantidad else 0 end) as andradeCantidad
      ,sum(case when sucursal='ANDRADE' then a.kilos else 0 end) as andradeKilos
      ,sum(case when sucursal='BOLIVAR' then a.cantidad else 0 end) as bolivarCantidad
      ,sum(case when sucursal='BOLIVAR' then a.kilos else 0 end) as bolivarKilos
      ,sum(case when sucursal='CALLE 4' then a.cantidad else 0 end) as calle4Cantidad
      ,sum(case when sucursal='CALLE 4' then a.kilos else 0 end) as calle4Kilos
      ,sum(case when sucursal='CF5FEBRERO' then a.cantidad else 0 end) as cf5febreroCantidad
      ,sum(case when sucursal='CF5FEBRERO' then a.kilos else 0 end) as cf5febreroKilos
      ,sum(case when sucursal='TACUBA' then a.cantidad else 0 end) as tacubaCantidad
      ,sum(case when sucursal='TACUBA' then a.kilos else 0 end) as tacubaKilos
      ,sum(case when sucursal='VERTIZ 176' then a.cantidad else 0 end) as vertizCantidad
      ,sum(case when sucursal='VERTIZ 176' then a.kilos else 0 end) as vertizKilos
      ,sum(case when sucursal='ZARAGOZA' then a.cantidad else 0 end) as zaragozaCantidad
      ,sum(case when sucursal='ZARAGOZA' then a.kilos else 0 end) as zaragozaKilos
      FROM (
      SELECT s.nombre AS sucursal,p.clave,p.descripcion,l.linea,g.nombre as grupo, c.clase,m.marca,p.unidad,p.kilos kgXmillar,p.gramos
      ,ROUND(SUM(D.CANTIDAD/(CASE WHEN P.UNIDAD='MIL' THEN 1000 ELSE 1 END) ),3) AS cantidad
      ,ROUND(SUM(D.CANTIDAD/(CASE WHEN P.UNIDAD='MIL' THEN 1000 ELSE 1 END)*P.KILOS),1) AS kilos
      FROM venta_det D join venta v on(v.id=d.venta_id) JOIN producto P ON(P.ID=D.PRODUCTO_ID) 
      JOIN linea l on(p.linea_id=l.id) 
      LEFT JOIN grupo_de_producto g on(p.grupo_id = g.id)
      left join clase c on(p.clase_id=c.id) left join marca m on(p.marca_id=m.id)
      JOIN sucursal S ON(S.ID=D.SUCURSAL_ID) join cuenta_por_cobrar f on(f.id=v.cuenta_por_cobrar_id)
      WHERE f.FECHA BETWEEN :FECHA_INICIAL AND :FECHA_FINAL and d.inventario_id is not null and f.cfdi_id is not null and f.cancelada is null
      GROUP BY clave,sucursal
      ) AS a
      group by a.clave
    """
  }

  /*
  *SQL Ventas Sucursales KILOS
  */
  String ventasPorlKilos() {
    return """
      SELECT a.clave,a.descripcion,a.linea grupo,a.linea,a.clase,a.marca,a.unidad,a.kgXmillar,a.gramos
      ,sum(a.kilos) kilos
      ,sum(case when sucursal='ANDRADE' then a.kilos else 0 end) as kilosAnd
      ,sum(case when sucursal='BOLIVAR' then a.kilos else 0 end) as kilosBol
      ,sum(case when sucursal='CALLE 4' then a.kilos else 0 end) as kilosCa4
      ,sum(case when sucursal='CF5FEBRERO' then a.kilos else 0 end) as kilos5fe
      ,sum(case when sucursal='TACUBA' then a.kilos else 0 end) as kilosTac
      ,sum(case when sucursal='VERTIZ 176' then a.kilos else 0 end) as kilosVer
      FROM (
      SELECT s.nombre AS sucursal,p.clave,p.descripcion,l.linea,c.clase,m.marca,p.unidad,p.kilos kgXmillar,p.gramos
      ,ROUND(SUM(D.CANTIDAD/(CASE WHEN P.UNIDAD='MIL' THEN 1000 ELSE 1 END) ),3) AS cantidad
      ,ROUND(SUM(D.CANTIDAD/(CASE WHEN P.UNIDAD='MIL' THEN 1000 ELSE 1 END)*P.KILOS),1) AS kilos
      FROM venta_det D join venta v on(v.id=d.venta_id) JOIN producto P ON(P.ID=D.PRODUCTO_ID) 
      join linea l on(p.linea_id=l.id) join clase c on(p.clase_id=c.id) join marca m on(p.marca_id=m.id)
      JOIN sucursal S ON(S.ID=D.SUCURSAL_ID) join cuenta_por_cobrar f on(f.id=v.cuenta_por_cobrar_id)
      WHERE f.FECHA BETWEEN @FECHA_INICIAL AND @FECHA_FINAL and d.inventario_id is not null and f.cfdi_id is not null and f.cancelada is null
      GROUP BY clave,sucursal
      ) AS a
      group by a.claves
    """
  }
}

