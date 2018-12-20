package sx.cfdi

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult
import groovy.xml.XmlUtil
import sx.core.Empresa
import sx.core.LogUser
import wslite.soap.SOAPClient
import wslite.soap.SOAPResponse

@Slf4j
// @GrailsCompileStatic
class CancelacionService implements  LogUser{

    SOAPClient client = new SOAPClient("https://cfdiws.sedeb2b.com/EdiwinWS/services/CFDi?wsdl")

    // @CompileDynamic
    CancelacionDeCfdi cancelarCfdi(Cfdi cfdi, boolean isTest = false) {
        validar(cfdi)
        log.info('Cancelando cfdi: {} {}', cfdi.uuid, isTest ? 'CFDI DE PRUEBA': '')

        Empresa empresa = Empresa.first()
        String url = 'http://cfdi.service.ediwinws.edicom.com'
        SOAPResponse response = client.send(SOAPAction: url, sslTrustAllCerts:true){
            body('xmlns:cfdi': 'http://cfdi.service.ediwinws.edicom.com') {
                cancelCFDiAsync {
                    user empresa.usuarioPac
                    password empresa.passwordPac
                    rfcE cfdi.emisorRfc
                    rfcR cfdi.receptorRfc
                    uuid cfdi.uuid
                    total cfdi.total
                    pfx(empresa.getCertificadoDigitalPfx().encodeBase64())
                    pfxPassword('pfxfilepapel')
                    test isTest
                }
            }
        }
        Map responseData = procesaResponse(response)

        CancelacionDeCfdi cancelacion = new CancelacionDeCfdi(cfdi: cfdi, uuid: cfdi.uuid)
        cancelacion.properties = responseData
        cancelacion.comentario = "CANCELACION "
        logEntity(cancelacion)
        cancelacion.save failOnError: true, flush: true
        cfdi.status = cancelacion.status
        cfdi.save flush: true
        return cancelacion

    }




    /**
     * <element name="ack" nillable="true" type="xsd:string"/>
     * <element name="cancelQueryData" nillable="true" type="impl:CancelQueryData"/>
     * <element name="rfcE" nillable="true" type="xsd:string"/>
     * <element name="status" nillable="true" type="xsd:string"/>
     * <element name="statusCode" nillable="true" type="xsd:string"/>
     * <element name="uuid" nillable="true" type="xsd:string"/>
     */
    def procesaResponse(SOAPResponse response){

        log.info('**************** Response text: {}', response.text)

        def res = response.cancelCFDiAsyncResponse
        GPathResult xml = new XmlSlurper().parseText(XmlUtil.serialize(res))

        // Acuse de recibo ack
        String acuse = new String(xml.cancelCFDiAsyncReturn.ack.decodeBase64())
        acuse = XmlUtil.serialize(acuse)
        log.info('Acuse de cancelación: {}', acuse)

        def cancelQuery = xml.breadthFirst().find { it.name() == 'cancelQueryData'}

        def statusCode = cancelQuery.breadthFirst().find { it.name() == 'statusCode'}
        def isCancelable = cancelQuery.breadthFirst().find { it.name() == 'isCancelable'}
        def status = cancelQuery.breadthFirst().find { it.name() == 'status'}
        def cancelStatus = cancelQuery.breadthFirst().find { it.name() == 'cancelStatus'}

        log.info("StatusCode: {} isCancelable: {} Status: {} CancelStatus: {}",
                statusCode, isCancelable, status, cancelStatus)

        Map responseData = [
                ack: acuse.getBytes("UTF-8"),
                statusCode: statusCode.text(),
                isCancelable: isCancelable.text(),
                cancelStatus: cancelStatus.text(),
                status: status.text()
        ]
        return responseData
    }

    def validar(Cfdi cfdi) {
        CancelacionDeCfdi found = CancelacionDeCfdi.where {cfdi == cfdi}.find()
        if(found)
            throw new CancelacionDeCfdiException(cfdi, "CFDI ya cancelado o en proceso de cancelación")
    }


}

class CancelacionDeCfdiException extends RuntimeException {

    Cfdi cfdi

    CancelacionDeCfdiException(Cfdi cfdi, String message) {
        super(message)
        this.cfdi = cfdi
    }
}
