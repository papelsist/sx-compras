package sx.cfdi

import grails.plugins.mail.MailService
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Cliente

import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream


@Slf4j
class CfdiMailService {

    CfdiPrintService cfdiPrintService

    CfdiLocationService cfdiLocationService

    MailService mailService

    Cfdi email(Cfdi cfdi, String targetEmail = null ) {

        if(targetEmail == null) {
            targetEmail = resolverTargetEmail(cfdi)
        }
        log.info('Enviando CFDI por email a: ', targetEmail)

        String message = """
            Apreciable cliente por este medio le hacemos llegar un comprobante fiscal digital (CFDI) .
            Este correo se envía de manera autmática favor de no responder a la dirección del mismo. Cualquier duda o aclaración
            la puede dirigir a: servicioaclientes@papelsa.com.mx
            """
        Byte[] xml = cfdiLocationService.getXml(cfdi)
        def pdf = cfdiPrintService.getPdf(cfdi)
        mailService.sendMail {
            multipart false
            to targetEmail
            from 'facturacion@papelsa.mobi'
            subject "CFDI ${cfdi.serie}-${cfdi.folio}"
            text message
            attach("${cfdi.serie}-${cfdi.folio}.xml", 'text/xml', xml)
            attach("${cfdi.serie}-${cfdi.folio}.pdf", 'application/pdf', pdf)
        }
        cfdi.enviado = new Date()
        cfdi.email = targetEmail
        cfdi.save flush: true
        log.debug('CFDI: {} enviado a: {}', cfdi.uuid, targetEmail)
        return cfdi
    }

    def envioBatch(List cfdis, String targetEmail, String observacion = ''){
        def zipData = zip(cfdis)

        mailService.sendMail {
            multipart false
            to targetEmail
            from 'facturacion@papelsa.mobi'
            subject "Envio de Comprobantes fiscales digitales (CFDIs) ${observacion}"
            html view: "/cfdi/envioBatch", model: [facturas: cfdis]
            attachBytes "comprobantes.zip", "application/x-compressed", zipData
        }
        cfdis.each { Cfdi cfdi ->
            try {
                cfdi.enviado = new Date()
                cfdi.email = targetEmail
                cfdi.save()
            } catch (Exception ex){

            }

        }

    }

    Byte[] zip(List cfdis){
        try{
            byte[] buffer = new byte[1024]
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()
            ZipOutputStream zos = new ZipOutputStream(byteArrayOutputStream)

            cfdis.each { Cfdi cfdi ->
                String name = "${cfdi.serie}-${cfdi.folio}.xml"
                ZipEntry ze = new ZipEntry(name);
                zos.putNextEntry(ze);
                Byte[] xml = cfdiLocationService.getXml(cfdi)
                zos.write(xml)
                zos.closeEntry();
                // PDF
                def pdf = cfdiPrintService.getPdf(cfdi)
                ZipEntry pdfEntry = new ZipEntry(name.replaceAll('xml', 'pdf'))
                zos.putNextEntry(pdfEntry);
                zos.write(pdf.bytes)
                zos.closeEntry();
            }
            zos.close();
            return byteArrayOutputStream.toByteArray()
        }catch (IOException ex) {
            String msg = ExceptionUtils.getRootCauseMessage(ex)
            println msg
            log.error(msg)
        }
    }

    private String resolverTargetEmail(Cfdi cfdi) {
        Cliente cliente = Cliente.where {rfc == cfdi.receptorRfc}.find()
        if (cliente) {
            String targetEmail = cliente.getCfdiMail()
            if(!cliente.cfdiValidado) {
                throw new RuntimeException("Correo ${targetEmail} de cliente ${cliente.nombre} no ha sido validado")
            }
            return targetEmail
        } else {
            throw new RuntimeException(" El cliente ${cliente.nombre} no tiene registrada email para CFDIs")
        }
    }
}
