package sx.cxp

import grails.compiler.GrailsCompileStatic

import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.web.multipart.MultipartFile

import sx.core.Proveedor

import groovy.xml.*


import grails.gorm.transactions.Transactional

// @Transactional
@Slf4j
// @GrailsCompileStatic
class ComprobanteFiscalService {

    static String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss"

    ComprobanteFiscal save(ComprobanteFiscal comprobanteFiscal) {
        comprobanteFiscal.save failOnError: true, flush: true
    }

    ComprobanteFiscal buildFromXml2(MultipartFile xmlFile) {
        return buildFromXml(xmlFile.getBytes(), xmlFile.getOriginalFilename())
    }

    ComprobanteFiscal buildFromXml(byte[] xmlData, String fileName){

        GPathResult xml = new XmlSlurper().parse(new ByteArrayInputStream(xmlData))

        def data = xml.attributes()
        log.debug("CFDI : {}", data)
        println 'XML: ' + data
        if(xml.name()!='Comprobante')
            throw new ComprobanteFiscalException(message:"${fileName} no es un CFDI valido")
        def version = data.Version


        if(version == null || version != '3.3'){
            throw new ComprobanteFiscalException(message:"${fileName} no es un CFDI version 3.3")
        }


        def receptorNode = xml.breadthFirst().find { it.name() == 'Receptor'}
        def receptorNombre = receptorNode.attributes()['Nombre']
        def receptorRfc = receptorNode.attributes()['Rfc']
        def usoCfdi = receptorNode.attributes()['UsoCFDI']

        def emisorNode = xml.breadthFirst().find { it.name() == 'Emisor'}
        def emisorNombre = emisorNode.attributes()['Nombre']
        def emisorRfc = emisorNode.attributes()['Rfc']



        def proveedor = Proveedor.findByRfc(emisorRfc)
        if(!proveedor)
            throw new ComprobanteFiscalException(
                    message:"El proveedor de RFC: ${emisorRfc} / ${emisorNombre} no esta dado de alta en el sistema")

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
        def tipo =  data['TipoDeComprobante']
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
                tipoDeComprobante: tipo,
                moneda: moneda,
                tipoDeCambio: tipoDeCamio,
                usoCfdi: usoCfdi
        )
        // comprobanteFiscal.save failOnError: true, flush: true
        return comprobanteFiscal
    }

    def generarCuentaPorPagar(ComprobanteFiscal comprobanteFiscal, String tipo) {
        if(comprobanteFiscal.tipoDeComprobante != 'I') return null
        CuentaPorPagar cxp  = new CuentaPorPagar(tipo: tipo)
        cxp.with {
            proveedor = comprobanteFiscal.proveedor
            nombre = comprobanteFiscal.emisorNombre
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
        cxp.createUser = 'PENDIENTE'
        cxp.updateUser = 'PENDIENTE'
        return cxp
    }

    def importarDirectorio(File dir = null, String tipo = 'COMPRAS') {
        if(!dir)
            dir = new File("/Users/rubencancino/Documents/compras2018")
        if(dir.isDirectory()){
            log.debug(" Directorio: {} ", dir.name)
        }
        dir.eachFile { File it ->
            if(it.isDirectory())
                importarDirectorio(it)
            else {
                if(it.name.endsWith('xml')) {
                    try{

                        log.info('Imp XML: {}', it.name)
                        ComprobanteFiscal cf = buildFromXml(it.bytes, it.name)

                        def pdf = new File(it.path.replace('.xml','.pdf'))
                        if(pdf.exists() && pdf.isFile()) {
                            log.info('Imp PDF: {}', pdf.name)
                            cf.pdf = pdf.bytes
                        }
                        cf.save failOnError: true, flush: true
                        if (cf.tipoDeComprobante == 'I'){
                            CuentaPorPagar cxp = this.generarCuentaPorPagar(cf, tipo)
                            cxp.comprobanteFiscal = cf
                            cxp.save failOnError: true, flush: true
                        }
                    }catch (Exception ex) {
                        String m = ExceptionUtils.getRootCauseMessage(ex)
                        log.error(m)
                    }

                }

            }
        }
    }



}


class ComprobanteFiscalException extends RuntimeException{
    String message
    ComprobanteFiscal comprobante
}





/*
class ComprobanteFiscalService {

    static transactional = false

    def  consultaService


    def actualizar(def cxp,def cfdiFile){
        log.info 'Actualizando CFDI para la cuenta por pagar:'+cxp.id

        File xmlFile = File.createTempFile(cfdiFile.getName(),".temp");
        cfdiFile.transferTo(xmlFile)

        def xml = new XmlSlurper().parse(xmlFile)
        SimpleDateFormat df=new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")

        def data=xml.attributes()
        log.debug 'Comprobante:  '+xml.attributes()
        if(xml.name()!='Comprobante')
            throw new ComprobanteFiscalException(message:"${cfdiFile.getOriginalFilename()} no es un CFDI valido")
        def version = data.version
        if(version == null){
            version = data.Version
        }

        if(version == '3.3'){
            //return new ImportadorDeCfdiV33().build(xml, cfdiFile, cxp)
            return new ImportadorDeCfdiV33().update(xml, cfdiFile, cxp)
        }

        //def data=xml.attributes()
        def empresa=Empresa.first()
        def receptorNode=xml.breadthFirst().find { it.name() == 'Receptor'}
        def receptorRfc=receptorNode.attributes()['rfc']



        def emisorNode= xml.breadthFirst().find { it.name() == 'Emisor'}
        def nombre=emisorNode.attributes()['nombre']
        def rfc=emisorNode.attributes()['rfc']

        if(empresa.rfc!=receptorRfc && empresa.rfc!= rfc){
            throw new ComprobanteFiscalException(
                    message:"Em el CFDI ${cfdiFile.getOriginalFilename()} el receptor (${receptorRfc}) no es para esta empresa (${empresa.rfc})")
        }

        def proveedor=Proveedor.findByRfc(rfc)

        if(!proveedor){
            log.debug "Alta de proveedor: $nombre ($rfc)"
            def domicilioFiscal=emisorNode.breadthFirst().find { it.name() == 'DomicilioFiscal'}
            def dom=domicilioFiscal.attributes()
            def direccion=new Direccion(
                    calle:dom.calle,
                    numeroExterior:dom.noExterior,
                    numeroInterior:dom.noInterior,
                    colonia:dom.colonia,
                    municipio:dom.municipio,
                    estado:dom.estado,
                    pais:dom.pais,
                    codigoPostal:dom.codigoPostal)
            proveedor=new Proveedor(nombre:nombre,rfc:rfc,direccion:direccion,empresa:empresa)
            proveedor.save failOnError:true,flush:true

        }


        def timbre=xml.breadthFirst().find { it.name() == 'TimbreFiscalDigital'}


        if(cxp.comprobante==null){
            cxp.comprobante=new ComprobanteFiscal(cxp:cxp,receptorRfc:receptorRfc)

        }
        def comprobante=cxp.comprobante

        comprobante.with{
            fecha=df.parse(data['fecha'])
            cfdi=xmlFile.getBytes()
            cfdiFileName=cfdiFile.getOriginalFilename()
            uuid=timbre.attributes()['UUID']
            serie=data['serie']
            folio=data['folio']
            emisorRfc=rfc
            total=data['total'] as BigDecimal
        }

        log.info 'Actualizando CFDI: '+comprobante

        cxp.comprobante=comprobante

        comprobante.validate()
        if(comprobante.hasErrors()){
            println 'Errores: '+comprobante.errors
        }

        cxp.save(failOnError:true,flush:true)
        log.info 'CFDI de cuenta por pagar actualizado: '+cxp
        return cxp
    }

    def registrarConceptos(def cxp,def xml){
        if(cxp.instanceOf(FacturaDeGastos)){
            def concepto=CuentaContable.buscarPorClave('600-0000')
            def conceptos=xml.breadthFirst().find { it.name() == 'Conceptos'}
            conceptos.children().each{
                def model=it.attributes()
                def det=new ConceptoDeGasto(
                        concepto:concepto,
                        tipo:'GASTOS',
                        descripcion:model['descripcion'],
                        unidad:model['unidad'],
                        cantidad:model['cantidad'],
                        valorUnitario:model['valorUnitario'],
                        importe:model['importe']
                )
                det.impuestoTasa=cxp.tasaDeImpuesto
                det.impuesto=MonedaUtils.calcularImpuesto(det.importe,det.impuestoTasa/100)
                det.total=det.importe+det.impuesto
                if(!cxp.conceptos){
                    det.retensionIsr=cxp.retensionIsr
                    //det.retensionIsrTasa=cxp.retensionIva
                    det.retension=cxp.retImp
                    det.retensionTasa=cxp.retTasa
                }
                cxp.addToConceptos(det)
            }

        }
    }

    def getXml(ComprobanteFiscal cf){
        ByteArrayInputStream is=new ByteArrayInputStream(cf.cfdi)
        def xml = new XmlSlurper().parse(is)
        return xml
    }



    def validar(ComprobanteFiscal cf){
        //Acuse acuse=buscarAcuse(cf.cxp.proveedor.rfc,cf.cxp.proveedor.)
        try {

            def xml=getXml(cf)
            def data=xml.attributes()
            def total=data['total']
            def version = data.version

            if(version==null){
                version = data.Version
                total = data.Total
                log.info('Validando CFDI version: '+version);
            }

            Acuse acuse=buscarAcuse(cf.emisorRfc,cf.receptorRfc,total,cf.uuid)

            JAXBContext context = JAXBContext.newInstance(Acuse.class);
            Marshaller m = context.createMarshaller();
            m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
            ByteArrayOutputStream out=new ByteArrayOutputStream()
            m.marshal(acuse,out);

            cf.acuse=out.toByteArray()
            cf.acuseEstado=acuse.getEstado().getValue().toString()
            cf.acuseCodigoEstatus=acuse.getCodigoEstatus().getValue().toString()
            cf.save flush:true,failOnError:true
            log.info 'CFDI validado '+cf.id
            return cf
        }
        catch(Exception e) {
            log.error e
            String msg=ExceptionUtils.getRootCauseMessage(e)
            throw new ComprobanteFiscalException(message:msg,comprobante:cf)
        }
    }

    def Acuse buscarAcuse(String emisorRfc,String receptorRfc,def stotal,String uuid){

        String qq="?re=$emisorRfc&rr=$receptorRfc&tt=$stotal&id=$uuid"
        log.info 'Validando en SAT Expresion impresa: '+qq
        Acuse acuse=consultaService.consulta(qq)
        log.info 'Acuse obtenido: '+acuse
        return acuse
    }




    def  toXml(Acuse acuse){
        try {
            JAXBContext context = JAXBContext.newInstance(Acuse.class);
            Marshaller m = context.createMarshaller();
            m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
            StringWriter w=new StringWriter();
            m.marshal(acuse,w);
            return w.toString();
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    def  toAcuse(byte[] data){
        try {
            JAXBContext context = JAXBContext.newInstance(Acuse.class)
            Unmarshaller u = context.createUnmarshaller()
            ByteArrayInputStream is=new ByteArrayInputStream(data)
            Object o = u.unmarshal( is )
            return (Acuse)o

        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    def getCfdiXml(ComprobanteFiscal cf){
        def xml = getXml(cf)
        return XmlUtil.serialize(xml)
    }



}


*/