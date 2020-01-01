package sx.sat

import groovy.util.logging.Slf4j
import sx.sat.SatMetadata

import org.springframework.beans.factory.annotation.Value

import sx.utils.Periodo

@Slf4j
class SatMetadataService {

    @Value('${siipapx.sat.metadata}')
    String metadataDir

        
    String metaDataFileName = 'metadata.txt'

    def registrosDelPeriodo(Integer ej, Integer ms){
        return SatMetadata
        .where{ejercicio == ej && mes == ms}
        .list([sort: 'fechaEmision', order: 'asc'])
    }

    def importar(Integer ejercicio, Integer mes) {
        log.info('Importando metadata para {}/{}', ejercicio, mes)
        String df = 'yyyy-MM-dd HH:mm:ss'
        def count = 0
        def dir = new File(metadataDir)
        def file = new File(metadataDir, 'metadata.txt').withReader('UTF-8') { reader ->
            String line = reader.readLine()
            line = reader.readLine() // IGnorar los encabezados
            while (line) {
                def split = line.split('~')
                def size = split.size()
                def fechaEmision = Date.parse(df,split[6]) 
                def ej = Periodo.obtenerYear(fechaEmision)
                def ms = Periodo.obtenerMes(fechaEmision) + 1
                if(ms > mes) {
                    break
                }
                if(mes == ms) {
                    new SatMetadata(line).save failOnError: true, flush: true
                }
                line = reader.readLine()
            }
            log.info('Rows: {}', count)
        }
    }


    def eliminarRegistros(Integer ejercicio, Integer mes) {
        def deleted = SatMetadata
        .executeUpdate('delete from SatMetadata where ejercicio = ? and mes = ?', ejercicio, mes)
        log.info('Registros eliminados: {}', deleted)
    }
    
}
