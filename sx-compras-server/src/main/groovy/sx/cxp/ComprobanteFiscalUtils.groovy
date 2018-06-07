package sx.cxp

import groovy.transform.CompileDynamic
import groovy.xml.XmlUtil
import org.springframework.stereotype.Component
import sx.core.Empresa
import wslite.soap.SOAPClient
import wslite.soap.SOAPResponse

@Component
class ComprobanteFiscalUtils {

    SOAPClient client = new SOAPClient("https://consultaqr.facturaelectronica.sat.gob.mx/ConsultaCFDIService.svc?singleWsdl")

    @CompileDynamic
    def getAcuse(ComprobanteFiscal comprobanteFiscal) {

        String ex = "?re=${comprobanteFiscal.emisorRfc}&rr=${comprobanteFiscal.receptorRfc}&tt=${comprobanteFiscal.total}&id=${comprobanteFiscal.uuid}"
        String url = 'http://tempuri.org/IConsultaCFDIService/Consulta'
        SOAPResponse response = client.send(SOAPAction: url, sslTrustAllCerts:true){
            body{
                Consulta {
                    expresionImpresa(ex)
                }
            }
        }
        def res = response.ConsultaResponse
        return res.decodeBase64()
    }

    /*
    def cancelar(Cfdi cfdi){

        assert found == null, "UUID: ${cfdi.uuid} ya cancelado"




        def xml = new XmlSlurper().parseText(XmlUtil.serialize(res))
        String xmlString = new String(xml.cancelaCFDiReturn.ack.decodeBase64())
        xmlString = XmlUtil.serialize(xmlString)
        def xml2 = new XmlSlurper().parseText(xmlString)

    }
    */
}
