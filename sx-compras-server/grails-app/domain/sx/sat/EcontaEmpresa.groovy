package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode


import java.security.KeyFactory
import java.security.PrivateKey
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import java.security.spec.PKCS8EncodedKeySpec

@Resource(uri='/api/sat/empresas', formats=['json'])
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes=['clave', 'rfc'])
class EcontaEmpresa {

    String id
    String clave
    String razonSocial
    String rfc
    String dataBaseUrl
    String username
    String password
    String certificado

    String sqlCatalogo
    String sqlBalanza
    String sqlAuxiliarCuentas
    String sqlAuxiliarFolios

    byte[] certificadoDigital
    byte[] llavePrivada
    PrivateKey privateKey

    Date dateCreated
    Date lastUpdated

    X509Certificate certificadoX509

    X509Certificate getCertificadoX509(){

        if(certificadoDigital && !certificadoX509){
            CertificateFactory fact= CertificateFactory.getInstance("X.509","BC")
            InputStream is=new ByteArrayInputStream(certificadoDigital)
            certificadoX509 = (X509Certificate)fact.generateCertificate(is)
            certificadoX509.checkValidity()
            is.close();
            this.certificadoX509 = certificadoX509
        }
        return certificadoX509;
    }

    PrivateKey getPrivateKey(){
        if(!privateKey && llavePrivada){
            final byte[] encodedKey=llavePrivada
            PKCS8EncodedKeySpec keySpec=new PKCS8EncodedKeySpec(encodedKey)
            final  KeyFactory keyFactory=KeyFactory.getInstance("RSA","BC")
            this.privateKey=keyFactory.generatePrivate(keySpec)

        }
        return privateKey;
    }

    static constraints = {
        rfc minSize:12, maxSize:13
        clave unique:['rfc']
        sqlCatalogo nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        sqlBalanza nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        sqlAuxiliarCuentas nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        sqlAuxiliarFolios nullable: true, maxSize:(1024 * 512)  // 50kb para almacenar el xml
        certificadoDigital nullable:true, maxSize: (1024*1024*5)
        llavePrivada nullable:true,maxSize: (1024*1024*5)
    }

    static  mapping={
        id generator:'uuid'
        table 'sat_econta_empresa'
    }

    static transients = ['certificadoX509', 'privateKey']

}