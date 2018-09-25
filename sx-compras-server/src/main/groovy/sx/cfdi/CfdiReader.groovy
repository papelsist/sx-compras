package sx.cfdi

import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult

import sx.core.Proveedor
import sx.cxp.ComprobanteFiscal
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

        def receptorNode = xml.breadthFirst().find { it.name() == 'Receptor'}
        def receptorNombre = receptorNode.attributes()['Nombre']
        def receptorRfc = receptorNode.attributes()['Rfc']
        def usoCfdi = receptorNode.attributes()['UsoCFDI']

        def emisorNode = xml.breadthFirst().find { it.name() == 'Emisor'}
        def emisorNombre = emisorNode.attributes()['Nombre']
        String emisorRfc = emisorNode.attributes()['Rfc'] ?: 'XAXX010101000'



        def proveedor = Proveedor.findByRfc(emisorRfc)
        if(!proveedor) {
            log.info('Proveedor {} not found ', emisorRfc)
            if(tipo == 'GASTOS') {
                proveedor = new Proveedor(nombre: emisorNombre, rfc: emisorRfc, tipo: tipo)
                proveedor.clave = "GS${emisorRfc[0..-4]}"
                proveedor.validate
                log.info('Errores: {} ', proveedor.errors)
                proveedor.save
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
        // comprobanteFiscal.save failOnError: true, flush: true
        return comprobanteFiscal
    }
}
