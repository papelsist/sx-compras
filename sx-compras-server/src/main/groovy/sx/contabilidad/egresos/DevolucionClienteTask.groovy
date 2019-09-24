package sx.contabilidad.egresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import lx.econta.catalogo.Cuenta
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.cxc.CobroTarjeta
import sx.tesoreria.CorteDeTarjeta
import sx.tesoreria.CorteDeTarjetaAplicacion
import sx.tesoreria.MovimientoDeCuenta
import sx.tesoreria.TipoDeAplicacion
import sx.utils.MonedaUtils
import sx.contabilidad.CuentaOperativaCliente
import sx.tesoreria.DevolucionCliente
import sx.core.Cliente
import sx.cxc.Cobro 

@Slf4j
@GrailsCompileStatic
@Component
class DevolucionClienteTask implements  AsientoBuilder, EgresoTask {

    /**
     * Genera los asientos requreidos por la poliza
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        DevolucionCliente d =findDevolucion(poliza)
        log.info("Generando Asientos para poliza para egreso: {}", d.egreso)
        cargoCliente(poliza, d)
        abonoBanco(poliza, d)
    }

    /**
     * Genera un cargo al cliente por devolucion de Dinero
     *
     * @param poliza
     * @param r
     */
    void cargoCliente(Poliza poliza, DevolucionCliente d){
        CuentaOperativaCliente co = buscarCuentaOperativa(d.cliente)
        MovimientoDeCuenta egreso = d.egreso
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia}" +
                      " (${d.fecha.format('dd/MM/yyyy')}) ${egreso.afavor} "
        Map row = [
            asiento: "PAGO_${egreso.tipo}",
            referencia: d.cliente.nombre,
            referencia2: d.cliente.nombre,
            origen: egreso.id,
            documento: egreso.referencia, 
            documentoTipo: 'DEV', 
            documentoFecha: d.fecha,
            sucursal: egreso.sucursal?: 'OFICINAS',
            //uuid: null , // Dato en duro para validar
             rfc: d.cliente.rfc,
             montoTotal: d.importe,
             moneda : 'MXN', 
             tc:  1.0  
        ]
        //buildComplementoDePago(row, egreso)
        def venta = '0000' 
        def suc= '0000'
        if(d.cobro.tipo == 'CON'){
            venta = '0001' 
            suc = d.cobro.sucursal.clave.padLeft(4,'0')
        }
        if(d.cobro.tipo == 'COD'){
            venta = '0002' 
            suc = d.cobro.sucursal.clave.padLeft(4,'0')

        }
        if(d.cobro.tipo == 'CRE'){
            venta = '0003' 
            suc = co.cuentaOperativa
        }
        String cv = "105-${venta}-${suc}-0000" 
        BigDecimal importe = MonedaUtils.calcularImporteDelTotal(d.importe)
        BigDecimal impuesto = d.importe - importe 

        if(d.concepto=='DEPOSITO_DEVUELTO'){

             cv = "102-0001-${buscarCuentaBancoCobro(d.cobro)}-0000"
             poliza.addToPartidas(mapRow(cv, desc, row,d.importe))
             
        }
        if(d.concepto=='DEPOSITO_POR_IDENTIFICAR'  ){
             cv = "205-0002-${buscarCuentaBancoCobro(d.cobro)}-0000"
             poliza.addToPartidas(mapRow(cv, desc, row,importe))
             if(egreso.cheque.fecha.format('dd/MM/yyyy') == egreso.cheque.fechaTransito.format('dd/MM/yyyy')){
                // IVA
                poliza.addToPartidas(mapRow('208-0003-0000-0000', desc, row, impuesto))
             }      
        }
        if(d.concepto=='SALDO_A_FAVOR' ){
            cv = "205-0001-${venta}-0000"
             poliza.addToPartidas(mapRow(cv, desc, row,importe))
             if(egreso.cheque.fecha.format('dd/MM/yyyy') == egreso.cheque.fechaTransito.format('dd/MM/yyyy')){
                // IVA
                poliza.addToPartidas(mapRow('208-0004-0000-0000', desc, row, impuesto))
             }
        } 
        if(d.concepto=='NOTA_CON') {
            cv = "105-${venta}-${suc}-0000"
            poliza.addToPartidas(mapRow(cv, desc, row,d.importe))    
        }      
        if( d.concepto=='NOTA_COD' || d.concepto=='NOTA_CRE' ){
            cv = "105-${venta}-${suc}-0000"
            if(egreso.concepto=='NOTA_CRE'){
                cv = "105-0003-${buscarCuentaOperativa(d.cliente)}-0000"
            }
            poliza.addToPartidas(mapRow(cv, desc, row,d.importe))
            if(egreso.cheque.fecha.format('dd/MM/yyyy') == egreso.cheque.fechaTransito.format('dd/MM/yyyy')){
                // IVA
                poliza.addToPartidas(mapRow('208-0001-0000-0000', desc, row, impuesto))
                if(d.cobro.formaDePago == 'BONIFICACION'){
                    poliza.addToPartidas(mapRow('209-0001-0000-0000', desc, row, 0.0, impuesto))
                }
                if(d.cobro.formaDePago == 'DEVOLUCION'){
                    poliza.addToPartidas(mapRow('209-0001-0000-0000', desc, row, 0.0, impuesto))
                }
            }
        }     
    }

    /**
    *   Abono al banco por devolucion de dinero al cliente
    *   @param poliza
    *   @param d  Devolucion Cliente
    */
    void abonoBanco(Poliza poliza, DevolucionCliente d) {
        MovimientoDeCuenta egreso = d.egreso
        String ctaBanco = "102-${egreso.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${egreso.cuenta.subCuentaOperativa}-0000"
        log.info('Cta de banco: {}, {} MXN: {}', ctaBanco, egreso.moneda, egreso.moneda == 'MXN')
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: d.cliente.nombre,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'DEV',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        //buildComplementoDePago(row, egreso)
        String desc = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "
        poliza.addToPartidas(mapRow(ctaBanco, desc, row, 0.0, egreso.importe.abs()))
    }

    CuentaOperativaCliente buscarCuentaOperativa(Cliente c) {
        CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == c}.find()
        if(!c) throw new RuntimeException("Client ${c.nombre} sin cuenta operativa")
        return co
    }

    String buscarCuentaBancoCobro(Cobro c){

        switch(c.formaDePago){
            case 'TRANSFERENCIA':
                return c.transferencia.cuentaDestino.subCuentaOperativa
            case 'DEPOSITO_CHEQUE':
            case 'DEPOSITO_EFECTIVO':
            case 'DEPOSITO_MIXTO':
            case 'DEPOSITO':
                return c.deposito.cuentaDestino.subCuentaOperativa
            case 'TARJETA_CREDITO':
                CobroTarjeta ct = c.tarjeta
                CorteDeTarjeta corte = CorteDeTarjeta.get(ct.corte)
                if(!corte) throw new RuntimeException("No existe CorteDeTarjeta para el cobro: ${c.id}")

                CorteDeTarjetaAplicacion ca = corte.aplicaciones.find {it.tipo.toString().contains('INGRESO')}

                return ca.ingreso.cuenta.subCuentaOperativa
            default:
                throw new RuntimeException("No existe subcuenta oprativa para fomra de pago: ${c.formaDePago}")
        }

    }

    DevolucionCliente findDevolucion(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        DevolucionCliente r = DevolucionCliente.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Devolucion al Cliente")
        return r
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {
        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago)
            asignarComplementoDePago(det, row)
        return det
    }

}
