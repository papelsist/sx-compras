package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import groovy.sql.Sql
import sx.contabilidad.*
import sx.core.Cliente
import sx.cxc.ChequeDevuelto
import sx.cxc.CuentaPorCobrar
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils
import java.sql.SQLException
import sx.core.Sucursal

@Slf4j
@Component
class ImpuestosSobreNominaProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Override
    String definirConcepto(Poliza poliza) {
        return "IMPUESTOS SOBRE NOMINA ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
       
        def mes = resolverMes(poliza.mes)
        log.info(" Generando asientos para tres {} -- {} -- {} ",poliza.mes,poliza.ejercicio, mes)
        String select = getSelect().replaceAll('@MES', mes).replaceAll('@EJERCICIO', poliza.ejercicio.toString())
        List rows = loadRegistros(select, [])
        def totalTres = 0.00
        def ctaImpuesto = '213-0004-0000-0000'

        rows.each { row ->
            def sucursalName = row.sucursal=='CALLE4'?'CALLE 4':row.sucursal
            def suc = Sucursal.findByNombre(sucursalName).clave.padLeft(4,'0')
            String ctaCentro = "600-0004-${suc}-0000"
            def importeTres = row.TRESPORCIEN
            totalTres += importeTres
            poliza.addToPartidas(mapRow(ctaCentro, "${row.sucursal} ${mes} ${poliza.ejercicio}",row,importeTres,0.00))
        }

        Map row1 = [
            asiento: 'Impuesto Sobre Nomina',
            referencia: '1',
            referencia2: '1',
            origen: mes,
            entidad: 'Nomina',
            documentoTipo: 'Nomina',
            sucursal: 'OFICINAS',
        ]

        poliza.addToPartidas(mapRow(ctaImpuesto,"Impuesto Sobre Nomina 4%",row1,0.00,totalTres))
        return poliza
    }


    def resolverMes(Integer mes) {
        def mesString = ''
        switch(mes) {
            case 1:
                mesString = 'Enero'
            break
            case 2:
                mesString = 'Febrero'
            break
            case 3:
                mesString = 'Marzo'
            break
            case 4:
                mesString = 'Abril'
            break
            case 5:
                mesString = 'Mayo'
            break
            case 6:
                mesString = 'Junio'
            break
            case 7:
                mesString = 'Julio'
            break
            case 8:
                mesString = 'Agosto'
            break
            case 9:
                mesString = 'Septiembre'
            break
            case 10:
                mesString = 'Octubre'
            break
            case 11:
                mesString = 'Noviembre'
            break
            case 12:
                mesString = 'Diciembre'
            break
            default:
                
            break
        }

        return mesString
         
    }


    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {
        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(   
            cuenta: cuenta,
            concepto: cuenta.descripcion,
            descripcion: descripcion,
            asiento: row.asiento,
            referencia: row.referencia2,
            referencia2: row.referencia2,
            origen: row.origen,
            entidad: 'Nomina',
            documentoTipo: 'Nomina',
            sucursal: row.sucursal,
            debe: debe.abs(),
            haber: haber.abs()       
        )
        return det
    }

    def loadRegistros(String sql, List params) {
        def db = getEmpleadosDB()
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

    def getEmpleadosDB() {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        String dbUrl = 'jdbc:mysql://10.10.1.229/sx_rh'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }


    String getSelect() {
        String query =
        """
            SELECT 
            'Impuesto Sobre Nomina' as asiento,mes as origen,
            E.UBICACION_ID as referencia2,(SELECT U.descripcion FROM ubicacion U WHERE U.ID=E.UBICACION_ID) AS sucursal
            ,sum(D.importe_excento) AS EXENTO
            ,sum(D.importe_gravado) AS GRAVADO
            ,SUM(D.importe_excento + D.importe_gravado) * .04 as TRESPORCIEN
            FROM 
            calendario a join calendario_det b on (b.calendario_id=a.id) join
            NOMINA N ON ( N.calendario_det_id= b.ID )
            JOIN empresa Y ON(Y.ID=N.empresa_id)
            JOIN nomina_por_empleado E ON(E.nomina_id=N.ID)
            JOIN empleado X ON(X.ID=E.empleado_id)
            LEFT JOIN nomina_por_empleado_det D ON(E.ID=D.parent_id)
            LEFT JOIN concepto_de_nomina C ON(C.ID=D.concepto_id)
            WHERE mes= '@MES' AND N.EJERCICIO= @EJERCICIO  and c.tipo='PERCEPCION'  and n.tipo not in('PTU')
            AND C.TIPO IS NOT NULL and  c.id not in (40,31,33,47,54,58,59,60)
            GROUP by ubicacion_id
        """
        return query
    }


}
