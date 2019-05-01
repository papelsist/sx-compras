package sx.cfdi

import org.springframework.beans.factory.annotation.Value

import groovy.util.logging.Slf4j

import grails.util.Environment

import org.apache.commons.io.FileUtils

import sx.core.AppConfig
import sx.utils.ZipUtils

@Slf4j
class CfdiLocationService {

    @Value('${siipapx.cfdi.dir}')
    String cfdisDir

    CfdiEdicomService cfdiEdicomService

    private AppConfig config

    Byte[] getXml(Cfdi cfdi, Boolean downloadIfNotFound = true){
        String fileName = cfdi.url.getPath().substring(cfdi.url.getPath().lastIndexOf('/')+1)
        File file = new File(getCfdiLocation(cfdi), fileName)

        if(!file.exists() && downloadIfNotFound) {
            log.info('Cfdi no localizado en los servidores locales, descargandolo de EDICOM....');
            file = downloadXmlFromUUID(cfdi)
            return file.getBytes()
        }
        return file.getBytes()
    }

    def getCfdiLocation(Cfdi cfdi) {
        def year = cfdi.fecha[Calendar.YEAR]
        def month = cfdi.fecha[Calendar.MONTH] + 1
        def dir = new File(getCfdiMainDir(), "${year}/${month}")
        dir.mkdirs()
        return dir
    }

    def downloadXmlFromUUID(Cfdi cfdi) {
        def res = cfdiEdicomService.getCfdiFromUUID(cfdi)
        Map map = ZipUtils.descomprimir(res)
        def entry = map.entrySet().iterator().next()
        def dir = getCfdiLocation(cfdi)
        String fileName = "${cfdi.serie}-${cfdi.folio}_SIGNED.xml"
        File target = new File(dir, fileName)
        FileUtils.writeByteArrayToFile(target, entry.getValue())
        cfdi.url = target.toURI().toURL()
        cfdi.fileName = fileName
        cfdi.comentario = "Actualizado desde EDICOM"
        cfdi.save flush: true
        return target
    }

    AppConfig getConfig() {
        if(!this.config){
            this.config = AppConfig.first()
        }
        return this.config
    }


    def getCfdiMainDir() {
        if(Environment.current == Environment.DEVELOPMENT){
            return cfdisDir
        } else {
            return getConfig().cfdiLocation
        }
    }


}
