package sx.cfdi

import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.GPathResult
import org.apache.commons.io.FileUtils
import org.apache.commons.lang3.exception.ExceptionUtils

@Slf4j
class CfdiFileReader {

    Closure filter = { File file ->
        String name = file.name
        return  file.isDirectory() || name.endsWith('.xml') || name.endsWith('.XML')
    }

    List<File> findFiles(File dir) {
        String[] names = ["xml", "XML"]
        List<File> res= FileUtils.listFiles(dir, names, true)
        res =  filterCfdisFiles(res)
        res.addAll(findPdfFiles(res))
        return res
    }

    List<File> filterCfdisFiles(List<File> files) {
        return files.findAll { File it ->
            return isCfdi33(it)
        }
    }

    boolean isCfdi33(File file) {
        try{
            def parser = new XmlSlurper(false, true)
            parser.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
            GPathResult xml = parser.parse(file)
            def data = xml.attributes()
            def version = data.Version
            if (version && version == '3.3') {
                return true
            }
            return false
        }catch (Exception ex) {
            String msg = ExceptionUtils.getRootCauseMessage(ex)
            log.error("Error analizando ${file.path} Error: ${msg}")
            println 'Error analizando: ' + file.path + 'Error: ' + msg
            return false
        }

    }

    def copyFiles(File destDir, List<File> files) {
        if(!destDir.exists()) {
            destDir.mkdirs()
        }
        files.each { File it ->
            FileUtils.copyFileToDirectory(it, destDir)
        }
    }

    def findPdfFiles(List<File> files) {
        List found =  []
        files.each { File f ->
            String p = f.getPath().replace('.xml', '.pdf').replace('.XML', '.pdf')
            File pdf = new File(p)
            if( pdf.exists()) {
              found << pdf
            }
        }
        return found
    }
}
