package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import groovy.transform.ToString

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*
import sx.activo.*
import sx.utils.Periodo

@Slf4j
@Component
class ActivoFijoProc implements  ProcesadorDePoliza, AsientoBuilder{

    /*
    @Autowired
    @Qualifier('inventariosProcGeneralesTask')
    InventariosProcGeneralesTask inventariosProcGeneralesTask

    @Autowired
    @Qualifier('inventariosProcRedondeoTask')
    InventariosProcRedondeoTask inventariosProcRedondeoTask
    */

    @Override
    String definirConcepto(Poliza poliza) {
        return "DEPRECIACIONES Y AMORTIZACIONES"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        
        def rowsMap = buscarDepreciacionesAgrupadas(2018, 4).groupBy{ it.cuenta}
        rowsMap.each { entry ->
            List partidas = entry.value
            partidas.each { depreciacion ->
                cargoDepreciacionContable(poliza, depreciacion)
            }
            abonoDepreciacionAcumulada(poliza, entry.key, entry.value)
        }
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

    def cargoDepreciacionContable(Poliza poliza, DepreciacionPorSucursal depreciacion) {

        String target = activoToDepreciacionContable[depreciacion.cuenta.clave]
        String clave = resolveCuentaPorSucursal(target, depreciacion.sucursal)

        CuentaContable cuenta = buscarCuenta(clave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: "DEPRECIACION ${Periodo.MESES[poliza.mes - 1]} ${poliza.ejercicio}",
                asiento: 'ACTIVO_FIJO',
                referencia: '',
                referencia2: '',
                origen: 'ACTIVO_DEPRECIACION',
                entidad: 'ActivoDepreciacion',
                documento: '',
                documentoTipo: '',
                documentoFecha: null,
                sucursal: depreciacion.sucursal,
                debe: depreciacion.importe,
                haber: 0.0
        )
        poliza.addToPartidas(det)
    }

    def abonoDepreciacionAcumulada(Poliza poliza, CuentaContable origen, List<DepreciacionPorSucursal> rows) {
        String target = activoToDepreciacionAcumulada[origen.clave]
        CuentaContable cuenta = buscarCuenta(target)
        BigDecimal importe = rows.sum 0.0, {it.importe}
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: "DEPRECIACION ${Periodo.MESES[poliza.mes - 1]} ${poliza.ejercicio}",
                asiento: 'ACTIVO_FIJO',
                referencia: '',
                referencia2: '',
                origen: 'ACTIVO_DEPRECIACION',
                entidad: 'ActivoDepreciacion',
                documento: '',
                documentoTipo: '',
                documentoFecha: null,
                sucursal: 'TODAS',
                debe: 0.0 ,
                haber: importe
        )
        poliza.addToPartidas(det)
    }

    def buscarDepreciacionesAgrupadas(Integer ejericio, Integer mes) {
        def rows = ActivoDepreciacion.findAll("""
            select new sx.contabilidad.diario.DepreciacionPorSucursal(
                a.cuentaContable,
                a.sucursalActual,
                sum(d.depreciacion)
                )
            from ActivoDepreciacion d 
            join d.activoFijo a
            where d.ejercicio = ?
              and d.mes = ?
            group by a.cuentaContable, a.sucursalActual
            order by a.cuentaContable.clave, a.sucursalActual desc
            """, [ejericio, mes])
        return rows
    } 

    private resolveCuentaPorSucursal(String cve, String sucursal) {
        String start = cve.substring(0,9)
        String term = getSucursalesMap()[sucursal.trim()]
        return start + term + '-0000'

    }  


    Map activoToDepreciacionAcumulada = [
    '152-0001-0000-0000': '171-0001-0001-0000',  // Equipo de Transporte
    '153-0001-0000-0000': '171-0002-0001-0000',  // 
    '154-0001-0000-0000': '171-0003-0001-0000', 
    '155-0001-0000-0000': '171-0004-0001-0000', 
    '156-0001-0000-0000': '171-0005-0001-0000', 
    '157-0001-0000-0000': '171-0006-0001-0000', 
    '170-0001-0000-0000': '171-0007-0001-0000', 
    '173-0001-0000-0000': '183-0001-0001-0000', 
    '181-0001-0000-0000': '183-0002-0001-0000'
    ]
    
    Map activoToDepreciacionContable =  [
    '152-0001-0000-0000': '613-0001-0000-0000', // Edificios
    '153-0001-0000-0000': '613-0002-0000-0000', // Maquinaria
    '154-0001-0000-0000': '613-0003-0000-0000', // Equipo de transporte
    '155-0001-0000-0000': '613-0004-0000-0000', // Mo y equipo de oficina
    '156-0001-0000-0000': '613-0005-0000-0000', // Equipo de computo
    '157-0001-0000-0000': '613-0006-0000-0000', // Telefonia
    '170-0001-0000-0000': '613-0007-0000-0000', // Mejoras a locales
    '173-0001-0000-0000': '614-0001-0000-0000', // Gastos diferidos
    '181-0001-0000-0000': '614-0002-0000-0000'  // Gastos de instalacion
    ]

    Map sucursales = [
        'OFICINAS': '0001',   
        'CALLE 4': '0010',
        'TACUBA': '0012',
        'ERMITA': '0011',
        'BOLIVAR': '0005',
        'ANDRADE': '0003',
        'QUERETARO': '0009',
        'TRANSITO': '0050',
        'CF5FEBRERO': '0013',
        'VERTIZ 176': '002',
        'SOLIS': '0014'
    ]

    Map getSucursalesMap() {
        Map map = [
            'OFICINAS': '0001',   
            'CALLE 4': '0010',
            'TACUBA': '0012',
            'ERMITA': '0011',
            'BOLIVAR': '0005',
            'ANDRADE': '0003',
            'QUERETARO': '0009',
            'TRANSITO': '0050',
            'CF5FEBRERO': '0013',
            'VERTIZ 176': '0002',
            'SOLIS': '0014'
        ]
        return map
    }


}

@ToString()
class DepreciacionPorSucursal {
    CuentaContable cuenta
    String sucursal
    BigDecimal importe

    DepreciacionPorSucursal(CuentaContable cuenta, String sucursal, BigDecimal importe) {
        this.cuenta = cuenta
        this.sucursal = sucursal
        this.importe = importe
    }
}
