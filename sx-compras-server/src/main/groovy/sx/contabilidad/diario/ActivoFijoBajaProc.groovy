package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import groovy.transform.ToString

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*
import sx.activo.*
import sx.utils.Periodo
import sx.cfdi.Cfdi


@Slf4j
@Component
class ActivoFijoBajaProc implements  ProcesadorDePoliza, AsientoBuilder{

    
    @Override
    String definirConcepto(Poliza poliza) {
        return "BAJA DE ACTIVO FIJO"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        
        List<BajaDeActivo> bajas = BajaDeActivo.where{fecha == poliza.fecha}.list()
        bajas.each { b->
            def factura = Cfdi.where{serie == b.facturaSerie && folio == b.facturaFolio}.find()
            cargoActivo(poliza, b, factura)
            cargoCostoDeActivo(poliza, b, factura)
            abonoActivo(poliza, b, factura)
        }
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

    def cargoActivo(Poliza poliza, BajaDeActivo baja, def factura = null) {
        def origen = baja.activo.cuentaContable
        String target = activoToDepreciacionAcumulada[origen.clave]
        CuentaContable cuenta = buscarCuenta(target)
        
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: "${baja.facturaSerie} ${baja.facturaFolio} (${baja.fechaFactura})  ${factura?.receptor}",
                asiento: 'BAJA_ACTIVO',
                referencia: '',
                referencia2: '',
                origen: baja.id.toString(),
                entidad: 'BajaDeActivo',
                documento: baja.facturaFolio,
                documentoTipo: baja.facturaSerie,
                documentoFecha: baja.fechaFactura,
                sucursal: baja.activo.sucursalActual,
                debe: baja.depreciacionContable,
                haber: 0.0,
                uuid: factura ? factura.uuid : null

        )
        poliza.addToPartidas(det)
    }

    def cargoCostoDeActivo(Poliza poliza, BajaDeActivo baja, def factura = null) {
        def origen = baja.activo.cuentaContable
        String target = activoToCostoDeActivo[origen.clave]
        CuentaContable cuenta = buscarCuenta(target)

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: "${baja.facturaSerie} ${baja.facturaFolio} ${baja.fechaFactura} ${factura?.receptor}",
                asiento: 'BAJA_ACTIVO',
                referencia: '',
                referencia2: '',
                origen: baja.id.toString(),
                entidad: 'BajaDeActivo',
                documento: baja.facturaFolio,
                documentoTipo: baja.facturaSerie,
                documentoFecha: baja.fechaFactura,
                sucursal: baja.activo.sucursalActual,
                debe: baja.remanenteContable,
                haber: 0.0,
                uuid: factura ? factura.uuid : null
        )
        poliza.addToPartidas(det)
    }

    def abonoActivo(Poliza poliza, BajaDeActivo baja, def factura = null) {
        def cuenta = baja.activo.cuentaContable
        
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: "${baja.facturaSerie} ${baja.facturaFolio} ${baja.fechaFactura} ${factura?.receptor}",
                asiento: 'BAJA_ACTIVO',
                referencia: '',
                referencia2: '',
                origen: baja.id.toString(),
                entidad: 'BajaDeActivo',
                documento: baja.facturaFolio,
                documentoTipo: baja.facturaSerie,
                documentoFecha: baja.fechaFactura,
                sucursal: baja.activo.sucursalActual,
                debe: 0.0,
                haber: baja.moiContable,
                uuid: factura ? factura.uuid : null
        )
        poliza.addToPartidas(det)
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
    
    Map activoToCostoDeActivo =  [
    '155-0001-0000-0000': '505-0001-0000-0000', // Mo y equipo de oficina
    '154-0001-0000-0000': '505-0002-0000-0000', // Equipo de transporte
    '153-0001-0000-0000': '613-0003-0000-0000', // Maquinaria
    '156-0001-0000-0000': '613-0004-0000-0000', // Equipo de computo
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

