package sx.cfdi

import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult

import sx.core.Proveedor
import sx.cxp.ComprobanteFiscal
import sx.cxp.ComprobanteFiscalConcepto
import sx.cxp.ComprobanteFiscalException

@Slf4j
@CompileStatic
class CfdiReader {

    static String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"



    @CompileDynamic
    ComprobanteFiscal readXml(byte[] xmlData, String fileName, String tipo){

        GPathResult xml = new XmlSlurper().parse(new ByteArrayInputStream(xmlData))

        def data = xml.attributes()


        if(xml.name()!='Comprobante')
            throw new ComprobanteFiscalException(message:"${fileName} no es un CFDI valido")

        def version = data.Version

        log.info('CFDI version {}', version)
        log.info('XML Data: {}', data)

        if(version != '3.2'){
            return null
            // log.debug('Tratando de importar con ver 3.2 para compras')
            // return importadorCfdi32.buildFromXml32(xml, xmlData ,fileName)

        }

        def receptorNode = xml.breadthFirst().find { it.name() == 'Receptor'}
        def receptorNombre = receptorNode.attributes()['Nombre']
        def receptorRfc = receptorNode.attributes()['Rfc']
        def usoCfdi = receptorNode.attributes()['UsoCFDI']

        def emisorNode = xml.breadthFirst().find { it.name() == 'Emisor'}
        def emisorNombre = emisorNode.attributes()['Nombre']
        String emisorRfc = emisorNode.attributes()['Rfc'] ?: 'XAXX010101000'



        def proveedor = Proveedor.findByRfc(emisorRfc)
        if(!proveedor) {
            if(tipo == 'GASTOS') {
                proveedor = new Proveedor(nombre: emisorNombre, rfc: emisorRfc, tipo: tipo)
                proveedor.clave = "GS${emisorRfc[0..-4]}"
                proveedor.tipo = tipo
                proveedor.save flush: true
                log.info('Nuevo proveedor registrado: {}', proveedor.nombre)
            } else {
                throw new ComprobanteFiscalException(
                        message:"El proveedor de RFC: ${emisorRfc} / ${emisorNombre} no esta dado de alta en el sistema")
            }
        }

        def serie = xml.attributes()['Serie']
        def folio = xml.attributes()['Folio']

        def fecha = Date.parse(DATE_FORMAT, xml.attributes()['Fecha'])
        def timbre = xml.breadthFirst().find { it.name() == 'TimbreFiscalDigital'}
        def uuid = timbre.attributes()['UUID']

        def total = data['Total'] as BigDecimal
        def subTotal = data['SubTotal'] as BigDecimal
        def descuento = data['Descuento'] as BigDecimal

        def formaDePago = data['FormaPago']
        def metodoDePago = data['MetodoPago']
        def tipoDeComprobante =  data['TipoDeComprobante']
        def moneda = data['Moneda']
        def tipoDeCamio = data['TipoCambio'] as BigDecimal

        def comprobanteFiscal=ComprobanteFiscal.findByUuid(uuid)

        if(comprobanteFiscal){
            return comprobanteFiscal
        }

        comprobanteFiscal=new ComprobanteFiscal(
                xml: xmlData,
                proveedor: proveedor,
                fileName: fileName,
                uuid: uuid,
                serie: serie,
                folio: folio,
                emisorNombre: emisorNombre,
                emisorRfc: emisorRfc,
                receptorRfc: receptorRfc,
                receptorNombre: receptorNombre,
                subTotal: subTotal,
                descuento: descuento,
                total: total,
                fecha: fecha,
                formaDePago: formaDePago,
                metodoDePago: metodoDePago,
                tipoDeComprobante: tipoDeComprobante,
                moneda: moneda,
                tipoDeCambio: tipoDeCamio?: 1.0,
                usoCfdi: usoCfdi,
                versionCfdi: '3.3'
        )
        if(tipo == 'GASTOS') {
            addConceptos(comprobanteFiscal, xml)
        }
        return comprobanteFiscal
    }

    @CompileDynamic
    def addConceptos(ComprobanteFiscal cfdi,  GPathResult xml) {
        cfdi.conceptos.clear()
        def conceptos = xml.Conceptos
        conceptos.childNodes().each{
            Map map = it.attributes()
            ComprobanteFiscalConcepto concepto = new ComprobanteFiscalConcepto()
            concepto.claveProdServ = map.ClaveProdServ
            concepto.claveUnidad = map.ClaveUnidad
            concepto.unidad = map.Unidad
            String descripcion = map.Descripcion
            if(descripcion.length() > 240) {
                log.info("Descripcion muy larga: ${descripcion}")
                descripcion = descripcion.substring(0, 240)
            }
            concepto.descripcion = descripcion
            concepto.cantidad = map.Cantidad.toBigDecimal()
            concepto.valorUnitario = map.ValorUnitario.toBigDecimal()
            concepto.importe = map.Importe.toBigDecimal()
            if(map.Descuento) {
                concepto.descuento = map.Descuento.toBigDecimal()    
            }

            /// Impuestos
            def impuestos = it.children().find { row -> row.name() == 'Impuestos'}

            if(impuestos) {
                log.info('Procesando : {}', impuestos.name())
                def traslados = impuestos.children().find { imp -> imp.name() == 'Traslados'}
                if(traslados) {
                    traslados.children().each { tr ->
                        Map attrs = tr.attributes()
                        def impuesto = attrs['Impuesto'] 
                        def tasa = attrs['TasaOCuota'] as BigDecimal
                        def importe = attrs['Importe'] as BigDecimal
                        
                        if(impuesto == '002' && tasa) {
                            concepto.ivaTrasladado = importe
                            concepto.ivaTrasladadoTasa = tasa
                        }
                        // println "Im: ${impuesto} Tasa: ${tasa} Importe: ${importe}"
                    }
                }
                def retenciones = impuestos.children().find { imp -> imp.name() == 'Retenciones'}
                if(retenciones) {
                    retenciones.children().each { tr ->
                        Map attrs = tr.attributes()
                        def impuesto = attrs['Impuesto']
                        def tasa = attrs['TasaOCuota'] as BigDecimal
                        def importe = attrs['Importe'] as BigDecimal
                        def base = attrs['Base']
                        if(impuesto == '002') {
                            concepto.ivaRetenido = importe
                            concepto.ivaRetenidoTasa = tasa
                        } else {
                            concepto.isrRetenido = importe
                            concepto.isrRetenidoTasa = tasa
                        }
                        // println "Retencion: ${impuesto} Tasa: ${tasa} Importe: ${importe}"
                    }
                }
            }

            cfdi.addToConceptos(concepto)
        }
    }

    /**
     VALIDACION DE PAGOS
    def cfdi = ComprobanteFiscal.get('8a8a81656b75902b016bafb140c60542')
    println "${cfdi.tipo} Tipo: ${cfdi.tipoDeComprobante}"
    def xml = cfdi.getXmlNode()
    def pagosNode = xml.breadthFirst().find { it.name() == 'Pagos'}

    def conceptos = xml.Complemento.Pagos
    conceptos.childNodes().each{
        Map map = it.attributes()
        // def n = it.DoctoRelacionado
        println "${it.name()} ${map}"
        def nn = it.childNodes().each { l ->
            println "D: ${l.attributes()}"
        }
}
    **/
}
