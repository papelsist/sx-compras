package sx.cfdi

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.transaction.NotTransactional
import groovy.transform.CompileDynamic

import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult
import groovy.xml.XmlUtil
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Empresa
import sx.core.LogUser
import wslite.soap.SOAPClient
import wslite.soap.SOAPResponse

@Slf4j
// @GrailsCompileStatic
class CancelacionService implements  LogUser{

    SOAPClient client = new SOAPClient("https://cfdiws.sedeb2b.com/EdiwinWS/services/CFDi?wsdl")

    // @CompileDynamic
    // @Transactional
    CancelacionDeCfdi cancelarCfdi(Cfdi cfdi, boolean isTest = false) {

        CancelacionDeCfdi found = CancelacionDeCfdi.where {cfdi == cfdi}.find()
        if(found) {
            cfdi.status = found.status
            cfdi.cancelado = new Date()
            cfdi.save flush: true
            return found
        }

        log.debug('Cancelando: {} Fecha: {}  Total: {} ', cfdi.uuid, cfdi.fecha, cfdi.total)

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
        cfdi.cancelado = new Date()
        cfdi.save flush: true
        log.debug("Solicitud OK CancelStatus: {} Status: {}", responseData['cancelStatus'], responseData['status'])
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

        // log.info('**************** Response text: {}', response.text)

        def res = response.cancelCFDiAsyncResponse
        GPathResult xml = new XmlSlurper().parseText(XmlUtil.serialize(res))

        // Acuse de recibo ack
        String acuse = new String(xml.cancelCFDiAsyncReturn.ack.decodeBase64())
        acuse = XmlUtil.serialize(acuse)
        // log.info('Acuse de cancelación: {}', acuse)

        def cancelQuery = xml.breadthFirst().find { it.name() == 'cancelQueryData'}

        def statusCode = cancelQuery.breadthFirst().find { it.name() == 'statusCode'}
        def isCancelable = cancelQuery.breadthFirst().find { it.name() == 'isCancelable'}
        def status = cancelQuery.breadthFirst().find { it.name() == 'status'}
        def cancelStatus = cancelQuery.breadthFirst().find { it.name() == 'cancelStatus'}
        /*
        log.info("StatusCode: {} isCancelable: {} Status: {} CancelStatus: {}",
                statusCode, isCancelable, status, cancelStatus)
                */

        Map responseData = [
                ack: acuse.getBytes("UTF-8"),
                statusCode: statusCode.text(),
                isCancelable: isCancelable.text(),
                cancelStatus: cancelStatus.text(),
                status: status.text()
        ]
        return responseData
    }



    /**
     * Get status de cancelacion con WebService de EDICOM
     * <element name="getCFDiStatus">
     *  <complexType>
     *   <sequence>
     *      <element name="user" type="xsd:string"/>
     *      <element name="password" type="xsd:string"/>
     *      <element name="rfcE" type="xsd:string"/>
     *      <element name="rfcR" type="xsd:string"/>
     *      <element name="uuid" type="xsd:string"/>
     *      <element name="total" type="xsd:double"/>
     *      <element name="test" type="xsd:boolean"/>
     *   </sequence>
     *  </complexType>
     * </element>
     *
     * @param cancelacion
     */
    def actualizarStatus(CancelacionDeCfdi cancelacion) {
        String url = 'http://cfdi.service.ediwinws.edicom.com'
        Empresa empresa = Empresa.first()
        Cfdi cfdi = cancelacion.cfdi
        log.info('Consultando status de CFDI : {} Cancel code: {}', cfdi.uuid, cancelacion.cancelStatus)
        SOAPResponse response = client.send(SOAPAction: url, sslTrustAllCerts:true){
            body('xmlns:cfdi': 'http://cfdi.service.ediwinws.edicom.com') {
                getCFDiStatus {
                    user empresa.usuarioPac
                    password empresa.passwordPac
                    rfcE cfdi.emisorRfc
                    rfcR cfdi.receptorRfc
                    uuid cfdi.uuid
                    total cfdi.total
                    test false
                }
            }
        }
        Map responseData = procesaStatusResponse(response)
        log.info('Respnose data: {}', responseData)
        cancelacion.properties = responseData
        cancelacion.comentario = "CONSUSLTA DE CANCELACION "
        logEntity(cancelacion)
        cancelacion.save failOnError: true, flush: true
        cfdi.status = cancelacion.status
        cfdi.save flush: true
        return cancelacion


    }

    def procesaStatusResponse(SOAPResponse response){

        def res = response.getCFDiStatusResponse
        GPathResult xml = new XmlSlurper().parseText(XmlUtil.serialize(res))

        def cancelQuery = xml.breadthFirst().find { it.name() == 'getCFDiStatusReturn'}
        def statusCode = cancelQuery.breadthFirst().find { it.name() == 'statusCode'}
        def isCancelable = cancelQuery.breadthFirst().find { it.name() == 'isCancelable'}
        def status = cancelQuery.breadthFirst().find { it.name() == 'status'}
        def cancelStatus = cancelQuery.breadthFirst().find { it.name() == 'cancelStatus'}

        Map responseData = [
                statusCode: statusCode.text(),
                isCancelable: isCancelable.text(),
                cancelStatus: cancelStatus.text(),
                status: status.text()
        ]
        return responseData
    }

    List<Cfdi> buscarPendientes(int max, String order) {
        List<Cfdi> pendientes = Cfdi.where{status == 'CANCELACION_PENDIENTE'}
                .list([max: max, sort: 'fecha', order: order])
        return pendientes
    }

    int generarSolicitudesDeCancelacion(int max = 10, String order = 'desc') {
        List<Cfdi> pendientes = buscarPendientes(max, order)
        log.info("{} Cancelaciones de CFDIs pendientes de SOLICITAR", pendientes.size())
        int solicitudes = 0
        pendientes.each {
            try {
                cancelarCfdi(it)
                solicitudes++
            }catch(Exception ex) {
                ex.printStackTrace()
                String msg = ExceptionUtils.getRootCauseMessage(ex)
                log.error("Error mandando cancelar cfdi {} Err: {}", it.uuid, msg)
            }
        }
        return solicitudes
    }

    @NotTransactional
    int actualizarSolicitudesDeCancelacion() {
        List<CancelacionDeCfdi> pendientes = CancelacionDeCfdi.where{status != 'Cancelado'}.list()
        log.info("**** {} Cancelaciones de CFDI pendientes de ACTUALIZAR", pendientes.size())
        int updates = 0
        pendientes.each {
            try {
                actualizarStatus(it)
                updates++
            }catch(Exception ex) {
                String msg = ExceptionUtils.getRootCauseMessage(ex)
                log.error("Error mandando actualizar  solicitud de cancelacion para cfdi {} Err: {}", it.uuid, msg)
            }
        }
        return updates
    }

    @NotTransactional
    def cancelacionManual(File dir, String emisorRfc, String receptorRfc, String uuidTarget, BigDecimal totalTarget) {
        log.info('Cancelacion manual de cfdi {}', uuidTarget)
        boolean isTest = false
        Empresa empresa = Empresa.first()
        String url = 'http://cfdi.service.ediwinws.edicom.com'
        SOAPResponse response = client.send(SOAPAction: url, sslTrustAllCerts:true){
            body('xmlns:cfdi': 'http://cfdi.service.ediwinws.edicom.com') {
                cancelCFDiAsync {
                    user empresa.usuarioPac
                    password empresa.passwordPac
                    rfcE emisorRfc
                    rfcR receptorRfc
                    uuid uuidTarget
                    total totalTarget
                    pfx(empresa.getCertificadoDigitalPfx().encodeBase64())
                    pfxPassword('pfxfilepapel')
                    test isTest
                }
            }
        }

        Map responseData = procesaResponse(response)
        File file = new File(dir,"${uuidTarget}_${responseData.status}.xml")
        file.write(new String(responseData.ack, 'UTF-8'))
        file.write(new String(responseData.ack))
        return responseData

    }


}

class CancelacionDeCfdiException extends RuntimeException {

    Cfdi cfdi

    CancelacionDeCfdiException(Cfdi cfdi, String message) {
        super(message)
        this.cfdi = cfdi
    }
}
