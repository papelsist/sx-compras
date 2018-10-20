package sx.bi

import grails.transaction.NotTransactional
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource
import sx.utils.Periodo


import sx.bi.VentaAcumuladaCommand


class VentaNetaService {

    def dataSourceResolve(){

        def driverManagerDs = new DriverManagerDataSource()
        driverManagerDs.driverClassName = "com.mysql.jdbc.Driver"
        driverManagerDs.url = 'jdbc:mysql://10.10.1.229/bi'
        driverManagerDs.username = 'root'
        driverManagerDs.password = 'sys'

        return driverManagerDs

    }

    def sqlConnect=new Sql(dataSourceResolve())


    def ventaNetaAcumulada(VentaAcumuladaCommand command){

        def periodo=new Periodo(command.fechaInicial,command.fechaFinal)

       def sql = ventaNetaAcumulada

		sql=sql.replaceAll("@YEAR", Periodo.obtenerYear(command.fechaFinal).toString())
		sql=sql.replaceAll("@MES", (Periodo.obtenerMes(command.fechaFinal)+1).toString())
        
		sql=sql.replaceAll("@FECHA_FIN", command.fechaFinal.format( 'yyyy-MM-dd' ))
		
		// Seleccion de campos a pintar por el sql segun selector		
		if(command.clasificacion.equals("LINEA")){
			sql=sql.replaceAll("@DESCRIPCION",  "'LIN' AS TIPO,D.LINEA_ID AS origenId,D.LINEA")
			sql=sql.replaceAll("@INVENTARIO", "'LIN' AS TIPO,D.LINEA_ID AS origenId,D.LINEA")
		}
		if(command.clasificacion.equals("CLIENTE")){
			sql=sql.replaceAll("@DESCRIPCION",  "'EXI' AS TIPO,D.CLIENTE_ID AS origenId,(CASE WHEN D.CLIENTE_ID=8 THEN '1 MOSTRADOR' ELSE D.CLIENTE END)")	
			sql=sql.replaceAll("@INVENTARIO", "'EXI' AS TIPO,8 AS origenId,'1 MOSTRADOR'")
		}
		if(command.clasificacion.equals("PRODUCTO")){
			sql=sql.replaceAll("@DESCRIPCION",  "'PRD' AS TIPO,D.PRODUCTO_ID AS origenId,CONCAT(D.CLAVE,' ',D.DESCRIPCION)")	
			sql=sql.replaceAll("@INVENTARIO", "'PRD' AS TIPO,D.PRODUCTO_ID AS origenId,CONCAT(D.CLAVE,' ',P.DESCRIPCION)")
		}
		if(command.clasificacion.equals("SUCURSAL")){
			sql=sql.replaceAll("@DESCRIPCION",  "'SUC' AS TIPO,D.SUCURSAL_ID AS origenId,D.SUC")
			sql=sql.replaceAll("@INVENTARIO", "'SUC' AS TIPO,D.SUCURSAL_ID AS origenId,D.SUCURSAL_NOMBRE")
		}
		if(command.clasificacion.equals("VENTA")){
			sql=sql.replaceAll("@DESCRIPCION", "'EXI' AS TIPO,1 AS origenId,(CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END)")	
			sql=sql.replaceAll("@INVENTARIO", "'EXI' AS TIPO,1 AS origenId,'CREDITO'")
		}
		if(command.clasificacion.equals("MES")){
			sql=sql.replaceAll("@DESCRIPCION", "'MES' AS TIPO,MONTH(D.FECHA) AS origenId,(SELECT M.MES_NOMBRE FROM meses M WHERE M.MES=MONTH(D.FECHA))")
			sql=sql.replaceAll("@INVENTARIO", "'MES' AS TIPO,D.MES AS origenId,(SELECT M.MES_NOMBRE FROM meses M WHERE M.MES=MONTH(D.FECHA))")
		}


		// Envio de Parametros para el sql de Tipo de Venta
		if(command.tipoVenta.equals("TODOS")){
			sql=sql.replaceAll("@VENTA", "")
		}
		if(command.tipoVenta.equals("CREDITO")){
			sql=sql.replaceAll("@VENTA", " AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CREDITO') ")
		}
		if(command.tipoVenta.equals("CONTADO")){
			sql=sql.replaceAll("@VENTA", " AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CONTADO') ")
		}

		
		//Envio de paramentros al sql para tipo de Producto, NAL, IMP y TOD
		if(command.tipo.equals("TODOS")){
			sql=sql.replaceAll("@TIPO_PROD", "")
		}
		if(command.tipo.equals("NACIONAL")){
			sql=sql.replaceAll("@TIPO_PROD", " AND  D.NACIONAL IS TRUE  ")
		}
		if(command.tipo.equals("IMPORTADO")){
			sql=sql.replaceAll("@TIPO_PROD", " AND  D.NACIONAL IS FALSE ")
		}
        
       
        def rows=sqlConnect.rows(sql)
        return rows
    }

    def ventaNetaMensual(VentaAcumuladaCommand  command){
        

        def periodo=new Periodo(command.fechaInicial,command.fechaFinal)
		
		def  sql=ventaNetaMensual

        sql=sql.replaceAll("@YEAR", Periodo.obtenerYear(command.fechaFinal).toString())
		sql=sql.replaceAll("@MES", (Periodo.obtenerMes(command.fechaFinal)+1).toString())
        sql=sql.replaceAll("@FECHA_INI", command.fechaInicial.format( 'yyyy-MM-dd' ))
		sql=sql.replaceAll("@FECHA_FIN", command.fechaFinal.format( 'yyyy-MM-dd' ))
				
		
		// Seleccion de campos a pintar por el sql segun selector		
		if(command.clasificacion.equals("LINEA")){
			sql=sql.replaceAll("@DESCRIPCION",  "'LIN' AS TIPO,D.LINEA_ID AS origenId,D.LINEA")
			sql=sql.replaceAll("@INVENTARIO", "'LIN' AS TIPO,L.ID AS origenId,L.LINEA")
		}
		if(command.clasificacion.equals("CLIENTE")){
			sql=sql.replaceAll("@DESCRIPCION",  "'EXI' AS TIPO,D.CLIENTE_ID AS origenId,(CASE WHEN D.CLIENTE_ID=8 THEN '1 MOSTRADOR' ELSE D.CLIENTE END)")	
			sql=sql.replaceAll("@INVENTARIO", "'EXI' AS TIPO,8 AS origenId,'1 MOSTRADOR'")
		}
		if(command.clasificacion.equals("PRODUCTO")){
			sql=sql.replaceAll("@DESCRIPCION",  "'PRD' AS TIPO,D.PRODUCTO_ID AS origenId,CONCAT(D.CLAVE,' ',D.DESCRIPCION)")	
			sql=sql.replaceAll("@INVENTARIO", "'PRD' AS TIPO,D.PRODUCTO_ID AS origenId,CONCAT(D.CLAVE,' ',P.DESCRIPCION)")
		}
		if(command.clasificacion.equals("SUCURSAL")){
			sql=sql.replaceAll("@DESCRIPCION",  "'SUC' AS TIPO,D.SUCURSAL_ID AS origenId,D.SUC")
			sql=sql.replaceAll("@INVENTARIO", "'SUC' AS TIPO,D.SUCURSAL_ID AS origenId,D.SUCURSAL_NOMBRE")
		}
		if(command.clasificacion.equals("VENTA")){
			sql=sql.replaceAll("@DESCRIPCION", "'EXI' AS TIPO,1 AS origenId,(CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END)")	
			sql=sql.replaceAll("@INVENTARIO", "'EXI' AS TIPO,1 AS origenId,'CREDITO'")
		}
		if(command.clasificacion.equals("MES")){
			sql=sql.replaceAll("@DESCRIPCION", "'MES' AS TIPO,MONTH(D.FECHA) AS origenId,(SELECT M.MES_NOMBRE FROM meses M WHERE M.MES=MONTH(D.FECHA))")
			sql=sql.replaceAll("@INVENTARIO", "'MES' AS TIPO,D.MES AS origenId,(SELECT M.MES_NOMBRE FROM meses M WHERE M.MES=MONTH(D.FECHA))")
		}

		// Envio de Parametros para el sql de Tipo de Venta
		if(command.tipoVenta.equals("TODOS")){
			sql=sql.replaceAll("@VENTA", "")
		}
		if(command.tipoVenta.equals("CREDITO")){
			sql=sql.replaceAll("@VENTA", " AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CREDITO') ")
		}
		if(command.tipoVenta.equals("CONTADO")){
			sql=sql.replaceAll("@VENTA", " AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CONTADO') ")
		}
		
        
         //Envio de paramentros al sql para tipo de Producto, NAL, IMP y TOD
		if(command.tipo.equals("TODOS")){
			sql=sql.replaceAll("@TIPO_PROD", "")
		}
		if(command.tipo.equals("NACIONAL")){
			sql=sql.replaceAll("@TIPO_PROD", " AND  D.NACIONAL IS TRUE  ")
		}
		if(command.tipo.equals("IMPORTADO")){
			sql=sql.replaceAll("@TIPO_PROD", " AND  D.NACIONAL IS FALSE ")
		}
		
        def rows=sqlConnect.rows(sql)
        return rows

    }

    def movimientoCosteado(VentaAcumuladaCommand  command,String id){

        def consulta = ""
        if (command.clasificacion.equals("LINEA"))
			 consulta=" AND D.LINEA_ID= '${id}'"
		if(command.clasificacion.equals("CLIENTE")){
			consulta=" AND D.CLIENTE_ID= '${id}' "
		}
		if(command.clasificacion.equals("PRODUCTO")){
			consulta=" AND D.PRODUCTO_ID= '${id}' "
		}
		if(command.clasificacion.equals("SUCURSAL")){
			consulta=" AND D.SUCURSAL_ID= '${id}' "
		}
		if(command.clasificacion.equals("VENTA")){
			
            consulta=" AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END)= '${command.tipoVenta}' "
		}
		if(command.clasificacion.equals("MES")){
			consulta=" AND MONTH(D.FECHA)= '${id}' "
		}


		def venta=""
		if(command.tipoVenta.equals("TODOS")){
			venta=""
		}
		if(command.tipoVenta.equals("CONTADO")){
			venta=" AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CONTADO') "
		}
		
		if(command.tipoVenta.equals("CREDITO")){
			venta=" AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CREDITO') "
		}

        def sql = movimientoCosteado

        sql=sql.replaceAll("@FECHA_INI",command.fechaInicial.format( 'yyyy-MM-dd' ))
		sql=sql.replaceAll("@FECHA_FIN",command.fechaFinal.format( 'yyyy-MM-dd' ))
		sql=sql.replaceAll("@ORIGEN_ID", consulta)
		sql=sql.replaceAll("@VENTA", venta)
		sql=sql.replaceAll("@MES", (Periodo.obtenerMes(command.fechaFinal)+1).toString())

        def rows=sqlConnect.rows(sql)
        return rows
    }

    def movimientoCosteadoDet(VentaAcumuladaCommand  command,String id, String clave){

        def consulta = ""
        if (command.clasificacion.equals("LINEA"))
			 consulta=" AND D.LINEA_ID= '${id}'"
		if(command.clasificacion.equals("CLIENTE")){
			consulta=" AND D.CLIENTE_ID= '${id}' "
		}
		if(command.clasificacion.equals("PRODUCTO")){
			consulta=" AND D.PRODUCTO_ID= '${id}' "
		}
		if(command.clasificacion.equals("SUCURSAL")){
			consulta=" AND D.SUCURSAL_ID= '${id}' "
		}
		if(command.clasificacion.equals("VENTA")){
			
            consulta=" AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END)= '${command.tipoVenta}' "
		}
		if(command.clasificacion.equals("MES")){
			consulta=" AND MONTH(D.FECHA)= '${id}' "
		}


		def venta=""
		if(command.tipoVenta.equals("TODOS")){
			venta=""
		}
		if(command.tipoVenta.equals("CONTADO")){
			venta=" AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CONTADO') "
		}
		
		if(command.tipoVenta.equals("CREDITO")){
			venta=" AND (CASE WHEN D.ORIGEN='CRE' THEN 'CREDITO' ELSE 'CONTADO' END) IN('CREDITO') "
		}

        def sql= movimientoCosteadoDet
		
	
		sql=sql.replaceAll("@FECHA_INI",command.fechaInicial.format( 'yyyy-MM-dd' ))
		sql=sql.replaceAll("@FECHA_FIN",command.fechaFinal.format( 'yyyy-MM-dd' ))
		sql=sql.replaceAll("@ORIGEN_ID", consulta)
		sql=sql.replaceAll("@VENTA", venta)
		sql=sql.replaceAll("@CLAVE", clave)

        def rows=sqlConnect.rows(sql)
        return rows

    }

     String ventaNetaAcumulada = """
        SELECT X.periodo,X.origenId,X.DESCRIP AS descripcion,ROUND(SUM(X.IMP_NETO),2) AS ventaNeta,ROUND(SUM(X.COSTO),2) AS costo
        ,(ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2)) AS importeUtilidad
        ,((ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2))*100)/ROUND(SUM(X.IMP_NETO),2) AS porcentajeUtilidad
        ,ROUND((X.KILOS),2) AS kilos,CASE WHEN ROUND(X.KILOS,0)=0 THEN 0 ELSE ROUND((X.IMP_NETO)/(X.KILOS),2) END AS precio_kilos
        ,CASE WHEN ROUND(X.KILOS,0)=0 THEN 0 ELSE ROUND(SUM(X.COSTO)/(X.KILOS),2) END AS costo_kilos
        ,0 AS inventarioCosteado
        FROM (
        SELECT 
        '@MES - @YEAR' AS PERIODO,@DESCRIPCION AS DESCRIP
        ,SUM(D.IMP_NETO) AS IMP_NETO,SUM(D.COSTO_NETO) AS COSTO,0.0 AS INV_COSTO ,SUM(D.KILOS) AS KILOS
        FROM  FACT_VENTASDET D  USE INDEX (FECHA) 
        WHERE D.CLAVE<>'ANTICIPO' AND D.FECHA BETWEEN '@YEAR/01/01' AND '@FECHA_FIN' @VENTA @TIPO_PROD
        GROUP BY  DESCRIP
        ) AS X  GROUP BY X.DESCRIP
        """

    String ventaNetaMensual ="""
        SELECT X.periodo ,X.origenId
        ,X.DESCRIP AS descripcion,ROUND(SUM(X.IMP_NETO),2) AS ventaNeta,ROUND(SUM(X.COSTO),2) AS costo
        ,(ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2)) AS importeUtilidad
        ,((ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2))*100)/ROUND(SUM(X.IMP_NETO),2) AS porcentajeUtilidad
        ,ROUND((X.KILOS),2) AS kilos,ROUND(SUM(X.IMP_NETO)/(X.KILOS),2) AS precio_kilos
        ,ROUND(SUM(X.COSTO)/(X.KILOS),2) AS costo_kilos
        ,(CASE WHEN X.TIPO='EXI' THEN 0 ELSE SUM(X.INV_COSTO) END) AS inventarioCosteado,SUM(X.KILOS_INV) AS kilosInv
        FROM (
        SELECT 
        '@MES - @YEAR' AS PERIODO,@DESCRIPCION AS DESCRIP
        ,SUM(D.IMP_NETO) AS IMP_NETO,SUM(D.COSTO_NETO) AS COSTO,0.0 AS INV_COSTO,SUM(D.KILOS) AS KILOS,0 AS KILOS_INV
        FROM  FACT_VENTASDET D  USE INDEX (FECHA)
        WHERE D.CLAVE<>'ANTICIPO' AND D.FECHA BETWEEN '@FECHA_INI' AND '@FECHA_FIN' @VENTA @TIPO_PROD
        GROUP BY  DESCRIP
        UNION
        SELECT 
        '@MES - @YEAR' AS PERIODO,@INVENTARIO AS DESCRIP
        ,0.0 AS IMP_NETO,0.0 AS COSTO,ROUND(SUM(D.CANTIDAD/(case when p.unidad = 'MIL' then 1000 else 0 end)*D.COSTO_PROMEDIO),2) AS INV_COSTO,0 AS KILOS,sum(D.CANTIDAD/(case when p.unidad = 'MIL' then 1000 else 0 end)*P.KILOS) AS KILOS_INV
        FROM  siipapx.existencia D JOIN siipapx.producto P ON (P.ID=D.PRODUCTO_ID) JOIN siipapx.linea L ON (L.ID=P.LINEA_ID) 
        WHERE D.ANIO=YEAR('@FECHA_INI') AND D.MES=MONTH('@FECHA_FIN') @TIPO_PROD
        GROUP BY  DESCRIP
        ) AS X  GROUP BY X.DESCRIP
    """

    String movimientoCosteado ="""SELECT X.linea,X.clase,X.marca,X.clave,X.descripcion,X.KXMIL AS kilosMillar,x.gramos,x.calibre,x.caras,x.deLinea,x.nacional
        ,ROUND(SUM(X.IMP_NETO),2) AS ventaNeta,ROUND(SUM(X.COSTO),2) AS costo
        ,(ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2)) AS importeUtilidad
        ,((ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2))*100)/ROUND(SUM(X.IMP_NETO),2) AS porcentajeUtilidad
        ,(CASE WHEN X.TIPO='EXI' THEN 0 ELSE SUM(X.INV_COSTO) END) AS inventarioCosteado,x.nacional
        ,ROUND((X.KILOS),2) AS kilos,ROUND(SUM(X.IMP_NETO),2)/ROUND((X.KILOS),2) AS precio_kilos
        ,ROUND(SUM(X.COSTO)/(X.KILOS),2) AS costo_kilos
        FROM (
        SELECT 
        D.TIPO,D.LINEA,D.CLAVE,D.DESCRIPCION,D.KXMIL,D.GRAMOS,D.CALIBRE,D.CARAS,(CASE WHEN D.DELINEA IS TRUE THEN 'L' ELSE 'E' END) AS DELINEA
        ,SUM(D.IMP_NETO) AS IMP_NETO,SUM(D.COSTO_NETO) AS COSTO,0.0 AS INV_COSTO,(CASE WHEN D.nacional IS TRUE THEN 'NAL' ELSE 'IMP' END) AS NACIONAL,SUM(D.KILOS) AS KILOS
        ,D.CLASE,D.MARCA
        FROM  FACT_VENTASDET D   USE INDEX (FECHA)
        WHERE D.CLAVE<>'ANTICIPO' @VENTA AND D.FECHA BETWEEN '@FECHA_INI' AND '@FECHA_FIN'  @ORIGEN_ID
        GROUP BY  D.CLAVE
        ) AS X  GROUP BY X.clave
    """

    String movimientoCosteadoDet ="""
        SELECT x.tipo,x.origen_id,x.cliente,x.docto,x.fechad,x.origen,x.suc,x.documento,x.fecha,X.linea,X.clave,X.descripcion
        ,ROUND(SUM(X.IMP_NETO),2) AS ventaNeta,ROUND(SUM(X.COSTO),2) AS costo
        ,(ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2)) AS importeUtilidad
        ,((ROUND(SUM(X.IMP_NETO),2)-ROUND(SUM(X.COSTO),2))*100)/ROUND(SUM(X.IMP_NETO),2) AS porcentajeUtilidad
        ,ROUND((X.KILOS),2) AS kilos,ROUND(SUM(X.IMP_NETO),2)/ROUND((X.KILOS),2) AS precio_kilos
        ,ROUND(SUM(X.COSTO)/(X.KILOS),2) AS costo_kilos
        FROM (
        SELECT D.TIPO,D.ORIGEN_ID,D.CLIENTE,D.DOCTO,D.FECHA AS FECHAD,D.ORIGEN,D.SUC,D.DOCTO AS DOCUMENTO,D.FECHA
        ,D.LINEA,D.CLAVE,D.DESCRIPCION,SUM(D.IMP_NETO) AS IMP_NETO,SUM(D.COSTO_NETO) AS COSTO,SUM(D.KILOS) AS KILOS
        FROM  FACT_VENTASDET D   USE INDEX (FECHA)
        WHERE D.CLAVE<>'ANTICIPO' AND D.FECHA BETWEEN '@FECHA_INI' AND '@FECHA_FIN' AND D.CLAVE='@CLAVE' @VENTA @ORIGEN_ID
        GROUP BY  D.CLAVE,d.DOCTO,d.fecha,d.sucursal_id
        ) AS X  GROUP BY X.clave,X.documento,X.fecha,X.suc
    """
}