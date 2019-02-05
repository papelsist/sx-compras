package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.transaction.NotTransactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult
import org.apache.commons.io.input.BOMInputStream
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import sx.cfdi.CfdiReader
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
    ComprobanteFiscal buildFromXml(File xmlFile, String fileName, String tipo){

        def inputStream =getValidInputStream(xmlFile)
        Reader fileReader = new InputStreamReader(inputStream,"UTF-8")
        CfdiReader reader = new CfdiReader()
        // ComprobanteFiscal comprobante = reader.readXml(xmlData, fileName, tipo)
        //return comprobante
        GPathResult xml = new XmlSlurper().parse(fileReader)

        def data = xml.attributes()

        if(xml.name()!='Comprobante')
            throw new ComprobanteFiscalException(message:"${fileName} no es un CFDI valido")
        def version = data.Version ?: data.version



        if(version == '3.2'){
            return importadorCfdi32.buildFromXml32(xml, xmlFile.bytes ,fileName, tipo)

        } else {
            log.info('Building CFDI 3.3 con File: {} Tipo: {}', fileName, tipo)
        }

        def receptorNode = xml.breadthFirst().find { it.name() == 'Receptor'}
        def receptorNombre = receptorNode.attributes()['Nombre']
        def receptorRfc = receptorNode.attributes()['Rfc']
        def usoCfdi = receptorNode.attributes()['UsoCFDI']

        def emisorNode = xml.breadthFirst().find { it.name() == 'Emisor'}
        def emisorNombre = emisorNode.attributes()['Nombre']
        String emisorRfc = emisorNode.attributes()['Rfc'] ?: 'XAXX010101000'



        def proveedor = Proveedor.findByRfc(emisorRfc)
        if (!proveedor) {
            if(tipo == 'GASTOS') {
                proveedor = new Proveedor(nombre: emisorNombre, rfc: emisorRfc, tipo: tipo)
                proveedor.clave = "GS${emisorRfc[0..-4]}"
                proveedor.save(failOnError: true, flush: true)
                log.info('Nuevo proveedor registrado {}  ', emisorRfc)
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

        def impuestos = xml.breadthFirst().find { it.name() == 'Impuestos'}
        def trasladados = 0.0
        def retenidos =  0.0
        if(impuestos) {
            trasladados = impuestos.attributes()['TotalImpuestosTrasladados'] as BigDecimal?: 0.0
            retenidos = impuestos.attributes()['TotalImpuestosRetenidos'] as BigDecimal?: 0.0
        }


        def comprobanteFiscal=ComprobanteFiscal.findByUuid(uuid)

        if(comprobanteFiscal){
            return comprobanteFiscal
        }

        comprobanteFiscal=new ComprobanteFiscal(
                xml: xmlFile.getBytes(),
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
                versionCfdi: '3.3',
                impuestoTrasladado: trasladados?: 0.0,
                impuestoRetenido: retenidos?: 0.0
        )

        if(tipo == 'GASTOS') {
            reader.addConceptos(comprobanteFiscal, xml)
        }
        return comprobanteFiscal

    }

    CuentaPorPagar generarCuentaPorPagar(ComprobanteFiscal comprobanteFiscal, String tipo) {
        if(comprobanteFiscal.tipoDeComprobante != 'I') return null
        CuentaPorPagar cxp  = new CuentaPorPagar(tipo: tipo)
        log.info("Generando CXP para {} Moneda: {}", comprobanteFiscal, comprobanteFiscal.moneda)
        def mm = Currency.getInstance(comprobanteFiscal.moneda)
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
        if(tipo == 'GASTOS') {
            cxp.importePorPagar = cxp.total
        }
        return cxp
    }

    int importacionLocal(String tipo, boolean deleteFiles) {
        def path = tipo == 'COMPRAS' ? this.cfdiDir : this.gastosDir
        File dir = new File(path)
        return importarDirectorio(dir, tipo, deleteFiles)
    }



    int importarDirectorio(File dir, String tipo, boolean  deleteFiles) {
        int rows = 0
        dir.eachFile { File it ->

            if(it.name.toLowerCase().endsWith('.xml')) {
                try{
                    ComprobanteFiscal cf = importar(it, tipo)
                    rows = rows + 1
                    if(deleteFiles)
                        cleanFile(it)
                }catch (Exception ex) {
                    String m = ExceptionUtils.getRootCauseMessage(ex)
                    log.error("Error importando ${it.name}: ${m}")
                } finally {
                    // Eliminar los archivos

                }

            }


        }
        return rows
    }


    @Transactional
    ComprobanteFiscal importar(File xmlFile, String tipo) {
        ComprobanteFiscal cf = buildFromXml(xmlFile, xmlFile.name, tipo)
        log.info('CFDI Generado: {}', cf)
        if(cf == null){
            cleanFile(xmlFile)
            return null
        }
        cf.tipo = tipo

        ComprobanteFiscal found = ComprobanteFiscal.where {uuid == cf.uuid}.find()
        if(!found) {
            def pdf = new File(xmlFile.path.replace('.xml','.pdf'))
            if(!pdf.exists()){
                pdf = new File(xmlFile.path.replace('.xml','.PDF'))
            }
            def maxSize = 10924 * 512 * 20 // 10MB
            if(pdf.exists() && pdf.isFile() && pdf.size() < maxSize) {
                cf.pdf = pdf.bytes
            }
            cf = cf.save failOnError: true, flush: true
            log.info('****** Entity CFDI generado {}', cf)
            if (cf.tipoDeComprobante == 'I'){
                CuentaPorPagar cxp = this.generarCuentaPorPagar(cf, tipo)
                cxp.comprobanteFiscal = cf
                cxp.save failOnError: true, flush: true

            } else if(cf.tipoDeComprobante == 'E'){
                NotaDeCreditoCxP nota = this.notaDeCreditoCxPService.generarNota(cf)

            }
            return cf

        } else {
            log.info('-----------* EL CFDI {} YA EXISTIA CON EL ID:{}', found.uuid, found.id)
            if(cf.tipoDeComprobante == 'I') {
                CuentaPorPagar cxp = CuentaPorPagar.where{comprobanteFiscal == cf}.find()
                if(!cxp){
                    cxp = this.generarCuentaPorPagar(cf, tipo)
                    cxp.comprobanteFiscal = cf
                    cxp = cxp.save failOnError: true, flush: true
                    log.info('****** CXP generada {}', cxp.id)
                } else {
                    log.info("---------- TAMBIEN CXP EXISTE CON ID: {}", cxp.id)
                }
            }
            return null
        }
    }

    /**
     * Clean The XML File and the PDF if exists
     *
     * @param xmlFile
     */
    void cleanFile(File xmlFile) {
        log.info('Eliminando: {}', xmlFile.path)
        xmlFile.delete()
        def pdf = new File(xmlFile.path.replace('.xml','.pdf'))
        if(!pdf.exists()) {
            pdf = new File(xmlFile.path.replace('.XML','.pdf'))
        }
        if(pdf.exists())
            pdf.delete()

    }

    @NotTransactional
    boolean isBOM(File file) {
        boolean res = false
        file.withInputStream { fis ->
            byte[] openingBytes = new byte[3]
            fis.read( openingBytes )
            if( openingBytes != [ 0xEF, 0xBB, 0xBF ] as byte[] ) {
               log.info("File {} needs to be converted from UTF-8 BOM to UTF-8 without BOM",  file.path )
                res = true
            }
        }
        return res
    }

    def getValidInputStream(File xmlFile) {
        BOMInputStream bomIn = new BOMInputStream(new FileInputStream(xmlFile))
        if(bomIn.hasBOM()) {
            log.info('BOM detected in file....')
            return bomIn
        } else {
            log.info('BOM NOT detected in file....')
            return new FileInputStream(xmlFile)
        }
    }


}


class ComprobanteFiscalException extends RuntimeException{
    String message
    ComprobanteFiscal comprobante
}
