package sx.integracion

import groovy.sql.*
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.compras.ListaDePreciosProveedor
import sx.compras.ListaDePreciosProveedorDet
import sx.core.Producto
import sx.core.Proveedor
import sx.core.ProveedorProducto

import java.sql.SQLException


class ImportadorDeListasProveedor {

    def importar(Long id, String moneda) {
        def rows = getRows(getMasterSql(), id, moneda)
        rows.each { row ->
            Proveedor proveedor = Proveedor.where{sw2 == row.proveedor_id }.find()
            ListaDePreciosProveedor lp = new ListaDePreciosProveedor()
            lp.proveedor = proveedor
            lp.properties = row
            lp.validate()
            // println lp
            // println lp.errors

            def partidas = getRows(getPartidasSql(), id, moneda)
            partidas.each { detRow ->
                ListaDePreciosProveedorDet det = new ListaDePreciosProveedorDet()
                Producto producto = Producto.where{sw2 == detRow.producto_id}.find()
                ProveedorProducto provProd = ProveedorProducto.where{proveedor == proveedor && producto == producto}.find()
                det.properties = detRow
                det.producto = provProd
                det.clave = producto.clave
                det.unidad = producto.unidad
                lp.addToPartidas(det)
                // det.validate()
                //println 'Errors: ' + det.errors
            }

            lp.save failOnError: true

        }
    }

    def getRows(String select, Long id, String moneda) {
        def db = getSql()
        try {
            return db.rows(select , [id, moneda])
        }catch (SQLException e){
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            println message
        }finally {
            db.close()
        }
    }

    def getSql() {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        String dbUrl = 'jdbc:mysql://10.10.1.228/produccion'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }

    def getMasterSql(){
        return """
	        select
            id as sw2,
            descripcion,
            proveedor_id ,
            year(fecha_ini) as ejercicio,
            month(fecha_ini)  as mes,
            fecha_ini as fechaInicial,
            fecha_fin as fechaFinal,
            'Admin' as updateUser,
            'Admin' as createUser,
            vigente,
			(select max(precio_mon) from sx_lp_provs_det  x where x.lista_id = l.id) as moneda
            from sx_lp_provs l where id = ? 
            and (select max(precio_mon) from sx_lp_provs_det  x where x.lista_id = l.id) = ?
        """
    }

    def getPartidasSql() {
        return """
    	select
            l.prod_id as producto_id,
            p.descripcion,
            l.precio_mon as moneda,
            l.precio,
            l.precio as precioAnterior,
            l.neto,
            l.desc1 as descuento1,
            l.desc2 as descuento2,
            l.desc3 as descuento3,
            l.desc4 as descuento4,
            l.desc_f as descuentoFinanciero
            from `sx_lp_provs_det` l join sx_productos p on(l.prod_id = p.producto_id)
            where lista_id = ? and precio_mon = ?
    """
    }

}
