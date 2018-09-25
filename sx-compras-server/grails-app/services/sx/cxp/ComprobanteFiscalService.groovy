package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import sx.core.LogUser
import sx.core.Proveedor


import grails.gorm.transactions.Transactional

// @Transactional
@Slf4j
@GrailsCompileStatic
class ComprobanteFiscalService implements  LogUser{

    static String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"

    @Value('${siipapx.cxp.cfdisDir}')
    String cfdiDir

    @Value('${siipapx.cxp.gastosDir}')
    String gastosDir

    ImportadorCfdi32 importadorCfdi32

    @Autowired NotaDeCreditoCxPService notaDeCreditoCxPService

    ComprobanteFiscal save(ComprobanteFiscal comprobanteFiscal) {
        comprobanteFiscal.save failOnError: true, flush: true
    }

    @CompileDynamic
    ComprobanteFiscal buildFromXml(byte[] xmlData, String fileName, String tipo){

        GPathResult xml = new XmlSlurper().parse(new ByteArrayInputStream(xmlData))

        def data = xml.attributes()

        if(xml.name()!='Comprobante')
            throw new ComprobanteFiscalException(message:"${fileName} no es un CFDI valido")
        def version = data.Version ?: data.version

        log.info('CFDI version {}', version)

        if(version == '3.2'){
            return null
            /*
            log.debug('Tratando de importar con ver 3.2 para compras')
            return importadorCfdi32.buildFromXml32(xml, xmlData ,fileName)
            */
        }
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

    CuentaPorPagar generarCuentaPorPagar(ComprobanteFiscal comprobanteFiscal, String tipo) {
        if(comprobanteFiscal.tipoDeComprobante != 'I') return null
        CuentaPorPagar cxp  = new CuentaPorPagar(tipo: tipo)
        cxp.with {
            proveedor = comprobanteFiscal.proveedor
            nombre = comprobanteFiscal.proveedor.nombre
            folio = comprobanteFiscal.folio
            serie = comprobanteFiscal.serie
            fecha = comprobanteFiscal.fecha
            moneda = Currency.getInstance(comprobanteFiscal.moneda)
            tipoDeCambio = comprobanteFiscal.tipoDeCambio
            subTotal = comprobanteFiscal.subTotal ?: 0.0
            impuestoTrasladado = comprobanteFiscal.impuestoTrasladado ?: 0.0
            impuestoRetenido = comprobanteFiscal.impuestoRetenido?: 0.0
            total = comprobanteFiscal.total
            descuentoFinanciero = comprobanteFiscal.proveedor.descuentoF
            uuid = comprobanteFiscal.uuid

        }
        def plazo = comprobanteFiscal.proveedor.plazo ?: 0
        cxp.vencimiento = cxp.fecha + plazo
        logEntity(cxp)
        if(cxp.updateUser == null) {
            cxp.updateUser = 'PENDIENTE'
            cxp.createUser = 'ADMIN'
        }
        return cxp
    }

    int importacionLocal(String tipo) {
        def path = tipo == 'COMPRAS' ? this.cfdiDir : this.gastosDir
        File dir = new File(path)
        assert dir.exists(), "No existe el directorio: ${path}"
        return importarDirectorio(dir, tipo)
    }

    int importarDirectorio(File dir, String tipo) {
        int rows = 0
        dir.eachFile { File it ->
            if(it.isDirectory())
                importarDirectorio(it, tipo)
            else {
                if(it.name.toLowerCase().endsWith('xml')) {
                    try{
                        ComprobanteFiscal cf = importar(it, tipo)
                        cleanFile(it)
                        if(cf) {
                            rows++
                        }
                    }catch (Exception ex) {
                        ex.printStackTrace()
                        String m = ExceptionUtils.getRootCauseMessage(ex)
                        log.error("Error importando ${it.name}: ${m}")
                    }


                }

            }
        }
        return rows
    }


    @Transactional
    ComprobanteFiscal importar(File xmlFile, String tipo) {
        ComprobanteFiscal cf = buildFromXml(xmlFile.bytes, xmlFile.name, tipo)
        if(cf == null){
            cleanFile(xmlFile)
            return null
        }


        cf.tipo = tipo
        ComprobanteFiscal found = ComprobanteFiscal.where {uuid == cf.uuid}.find()
        if(!found) {
            def pdf = new File(xmlFile.path.replace('.xml','.pdf'))
            def maxSize = 10924 * 512 * 20 // 10MB
            if(pdf.exists() && pdf.isFile() && pdf.size() < maxSize) {
                cf.pdf = pdf.bytes
            }
            cf.save failOnError: true, flush: true
            if (cf.tipoDeComprobante == 'I'){
                CuentaPorPagar cxp = this.generarCuentaPorPagar(cf, tipo)
                cxp.comprobanteFiscal = cf
                cxp.save failOnError: true, flush: true

            } else {
                NotaDeCreditoCxP nota = this.notaDeCreditoCxPService.generarNota(cf)

            }
            return cf

        } else {
            return null
        }
    }

    /**
     * Clean The XML File and the PDF if exists
     *
     * @param xmlFile
     */
    void cleanFile(File xmlFile) {
        xmlFile.delete()
        def pdf = new File(xmlFile.path.replace('.xml','.pdf'))
        if(pdf.exists()) pdf.delete()
    }

    /*
    void importarDeImpap(Byte[] data) {
        File dir = new File(this.cfdiDir)
        assert dir.exists(), "No existe el directorio: ${this.cfdiDir}"
        File target = new File(dir, 'test')
        target.write(new String[data], 'UTF-8')
    }
    */
}


class ComprobanteFiscalException extends RuntimeException{
    String message
    ComprobanteFiscal comprobante
}
