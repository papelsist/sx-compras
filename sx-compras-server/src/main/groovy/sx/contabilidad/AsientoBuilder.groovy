package sx.contabilidad

import sx.utils.MonedaUtils

/**
 * Trait para simplificar la generacion de asientos contables, util en la generacion de polizas
 * y partiendo de la primisa de que los asientos deben ir cuadrados es decir los Debe - Haber == 0
 *
 */
abstract trait AsientoBuilder implements  SqlAccess{

    /**
     * Metodo a implementar por el asiento requerido
     *
     * @param Poliza
     * @return
     */
    abstract generarAsientos(Poliza poliza, Map params)

    PolizaDet buildRegistro(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave, row)
            def cto = concatenar(cuenta)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.cliente,
                referencia2: row.cliente,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.factura,
                documentoTipo: row.tipo,
                documentoFecha: row.fecha_fac,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs()
        )
        // Datos del complemento
        asignarComprobanteNacional(det, row)
        asignarComplementoDePago(det, row)
        return det
    }

    /**
     * Asigna las propiedades relacionadas con el comprobante nacional
     *
     * @param det El registro de PolizaDet
     * @param row El objeto con las propiedades
     */
    void asignarComprobanteNacional(PolizaDet det, def row) {
        det.uuid = row.uuid
        det.rfc = row.rfc
        det.montoTotal = row.montoTotal
        det.moneda = row.moneda
        det.tipCamb = row.tc
    }

    /**
     * Asigna las propiedades relacionadas con el metodo de pago
     * para ser usadas en la generacion del complemento de pago del
     * SAT
     *
     * @param det
     * @param row
     */
    void asignarComplementoDePago(PolizaDet det, def row) {
        det.montoTotalPago = row.montoTotalPago
        det.metodoDePago = row.metodoDePago
        det.beneficiario = row.beneficiario
        det.bancoOrigen = row.bancoOrigen
        det.bancoDestino = row.bancoDestino
        det.ctaOrigen = row.ctaOrigen
        det.ctaDestino = row.ctaDestino
        det.rfc = row.rfc
        det.referenciaBancaria = row.referenciaBancaria
        if(det.metodoDePago != '01') {
            if(det.ctaOrigen == null) {
                // det.metodoDePago = '99'
            }
        }

    }

    /**
     * Utility method para econtrar una cuenta contable por clave
     *
     * @param clave
     * @return
     */
    CuentaContable buscarCuenta(String clave, Map data = [:]) {
        CuentaContable cuenta = CuentaContable.where{clave == clave}.find()
        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable ${clave} ${data}")
        return cuenta
    }

    /**
     * Utility method para generar fechas
     *
     * @param date
     * @return
     */
    String toSqlDate(Date date){
        return date.format('yyyy-MM-dd')
    }


    def concatenar(CuentaContable cta) {
        String cto = cta.descripcion 
      def sucursales = ['OFICINAS','ANDRADE','BOLIVAR','CALLE 4','CF5FEBRERO','SOLIS','VERTIZ 176','TACUBA','VENTAS','SOLIS']
        def nivel = cta.nivel
        def p1 = cta.padre
        
        if(p1){
            // Nivel 3
          
             if(nivel == 3){
                   
              	for(int i=0 ; i < sucursales.size(); i++){
                
                     
                    if (cta.descripcion.contains(sucursales[i])) {
                        cto = "${cta.padre.descripcion}  ${cta.descripcion} 3"
                        break
                    } 
                        cto = "${cta.padre.descripcion} 3"
             	}
            } 
            //nivel 4
            if(nivel == 4){  
                //for 1
                for(int i=0 ; i< sucursales.size(); i++){
                    // if 1
                    if (cta.descripcion.contains(sucursales[i])) {
                        def ctaN3= cta.padre
                        for(int x=0 ; x< sucursales.size(); x++){
                        	if (cta.descripcion.contains(sucursales[x])) {
                                cto = ctaN3.padre.descripcion
                                break
                            }else{
                                cto = "${ctaN3.padre.descripcion}  ${ctaN3.descripcion} 4"
                                break
                            }
                        }
                       break 
                    }// termina if 1 
                    def ctaN3= cta.padre
                    //for 2
                    for(int x=0 ; x< sucursales.size(); x++){
                        if (ctaN3.descripcion.contains(sucursales[x])) {
                            cto = "${ctaN3.padre.descripcion} ${cta.descripcion} 4"
                            break
                        }else{
                            cto = "${ctaN3.padre.descripcion}  ${ctaN3.descripcion} ${cta.descripcion} 4"             
                        }
                    } // termina for 2
                }// terminia for 1
            }//Termina nivel 4
        }
	    
        /*
        String cto = cta.descripcion
        def p1 = cta.padre
        if(p1) {
            cto = p1.descripcion + " " + cto
            def p2 = p1.padre
            if(p2) {
                cto = p2.descripcion + " " + cto
                def p3 = p2.padre
                if(p3) {
                    cto = p3.descripcion + " " + cto
                }
            }
        }
        */

        return cto
    }



    /**
     * Genera una descripcion uniforme para todo el asiento
     * la implementacion por defualt regresa el valor: 'DESCRIPCION PENDIENTE'
     *
     * @param row El objeto base para obtener la descripcion
     *
     * @return
     */
    String generarDescripcion(Map row) {
        return 'DESCRIPCION PENDIENTE'
    }

}