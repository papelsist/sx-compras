package sx.cfdi


import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.util.Environment

import groovy.util.logging.Slf4j

import org.apache.commons.io.FileUtils

import sx.cfdi.providers.edicom.CFDi

import sx.core.Empresa
import sx.utils.ZipUtils


@Slf4j
// @GrailsCompileStatic
@Transactional
class CfdiTimbradoService {

    // WS cerpiService
    CFDi edicomService
    CfdiEdicomService cfdiEdicomService

    Empresa empresaTransient

    Cfdi timbrar(Cfdi cfdi) {
        timbrarEdicom(cfdi)
        return cfdi
    }

    /**
     * Web Service SAOP (wsdl) para los diversos servicios de timbado proporcionados por EDICOM. Actualmente
     * se requiere habilitar un certificado inadecuado
     * Utilizando (en Mac o unix): sudo keytool -importcert -alias edicom -file ~/dumps/certificados/caedicom01.cer -keystore cacerts;
     *
     */
    Cfdi timbrarEdicom(Cfdi cfdi) {
        File file = FileUtils.toFile(cfdi.url)
        // log.debug('Timbrando archivo {}' ,file.getPath())
        byte[] res = null
        if (this.isTimbradoDePrueba()) {
            log.debug('Timbrado de prueba')
            // res = edicomService.getCfdiTest('PAP830101CR3','yqjvqfofb', file.bytes)
            res = cfdiEdicomService.getCfdiTest(file.bytes)
        } else {
            res = cfdiEdicomService.getCfdi(file.bytes)
        }

        Map map = ZipUtils.descomprimir(res)

        def entry = map.entrySet().iterator().next()
        def targetName = file.getName().replaceAll(".xml", "_SIGNED.xml")
        File target = new File(file.getParent(), targetName)

        FileUtils.writeByteArrayToFile(target, entry.getValue())
        log.debug('Timbrado OK Archio: {}', target.getPath())
        CfdiTimbre timbre = new CfdiTimbre(entry.getValue())
        cfdi.uuid = timbre.uuid
        cfdi.url = target.toURI().toURL()
        cfdi.fileName = targetName
        cfdi.save flush: true
        return cfdi
    }



    /**
     * Cancela el CFDI utilizando el servicio del proveedor de timbrado activo
     *
     * @param cfdi
     * @return
     */
    def cancelar(Cfdi cfdi){
        cancelarEdicom(cfdi)

    }

    /**
     * Cancela el CFDI utilizando el serivio de EDICOM
     *
     * @param cfdi
     * @return
     */
    def cancelarEdicom(Cfdi cfdi) {
        if(cfdi.uuid == null) {
            throw new RuntimeException("El Cfdi ${cfdi.serie} - ${cfdi.folio} no se a timbrado por lo que no puede ser cancelado")
        }
        CfdiCancelado cancelacion = new CfdiCancelado()
        cancelacion.cfdi = cfdi
        cancelacion.uuid = cfdi.uuid
        cancelacion.serie = cfdi.serie
        cancelacion.folio = cfdi.folio

        // Iniciando cancelacion
        Empresa empresa = getEmpresa()
        String[] uuids = [cfdi.uuid] as String[]
        log.debug('Cancelando: {}' , cfdi.uuid)
        edicomService.cancelaCFDi(
                empresa.usuarioPac,
                empresa.passwordPac,
                empresa.rfc,
                uuids,
                empresa.certificadoDigitalPfx,
                'pfxfilepapel')

    }

    Boolean isTimbradoDePrueba() {
        Boolean produccion = (Environment.current == Environment.PRODUCTION)
        Boolean queretaro = Environment.current.name == 'queretaro'
        return !(produccion || queretaro)
    }

    Empresa getEmpresa() {
        if(!empresaTransient) {
            empresaTransient = Empresa.first()
        }
        return empresaTransient
    }

}
