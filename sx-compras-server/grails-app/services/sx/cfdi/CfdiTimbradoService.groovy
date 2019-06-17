package sx.cfdi


import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.util.Environment

import groovy.util.logging.Slf4j

import org.apache.commons.io.FileUtils
import org.apache.commons.lang3.exception.ExceptionUtils
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
        byte[] res = null
        if (this.isTimbradoDePrueba()) {
            log.debug('Timbrado de prueba')
            res = cfdiEdicomService.getCfdiTest(file.bytes)
        } else {
            res = cfdiEdicomService.getCfdi(file.bytes)
        }

        Map map = ZipUtils.descomprimir(res)
        def entry = map.entrySet().iterator().next()


        CfdiTimbre timbre = new CfdiTimbre(entry.getValue())
        cfdi.uuid = timbre.uuid
        log.debug('Timbrado exitoso UUID: {}', cfdi.uuid)

        File target = saveToDisk(cfdi, file, entry.getValue())
        if(target) {
            cfdi.url = target.toURI().toURL()
            cfdi.fileName = target.getName()
        }
        cfdi.save failOnError: true, flush: true
        return cfdi
    }

    private File saveToDisk(Cfdi cfdi, File file, byte[] xmlSignedData) {
        try {

            String targetName = file.getName().replaceAll(".xml", "_SIGNED.xml")
            File target = new File(file.getParent(), targetName)
            FileUtils.writeByteArrayToFile(target, xmlSignedData)
            log.debug('{} en Archivo: {}', cfdi.uuid, target.getPath())
            return target
        }catch( Exception ex) {
            Throwable c = ExceptionUtils.getRootCause(ex)
            String msg = ExceptionUtils.getRootCauseMessage(ex)
            log.error('Error al salvar en archivo UUID: {} Error: {} ', cfdi.uuid, msg, c)
            cfdi.comentario = 'NO SE PUDO SALVAR EN ARCHIVO'
        }

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
        /*
        Boolean produccion = (Environment.current == Environment.PRODUCTION)
        Boolean queretaro = Environment.current.name == 'queretaro'
        return !(produccion || queretaro)
        */
        return Environment.current == Environment.DEVELOPMENT
    }

    Empresa getEmpresa() {
        if(!empresaTransient) {
            empresaTransient = Empresa.first()
        }
        return empresaTransient
    }

}
