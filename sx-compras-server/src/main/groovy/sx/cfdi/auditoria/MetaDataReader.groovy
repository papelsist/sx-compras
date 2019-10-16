package sx.cfdi.auditoria

import groovy.util.logging.Slf4j
import sx.sat.SatMetadata

import org.springframework.beans.factory.annotation.Value

import sx.utils.Periodo

@Slf4j
class MetaDataReader {

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
        def count = 0, MAXSIZE = 100
        def dir = new File(metadataDir)
        def file = new File(metadataDir, 'metadata.txt').withReader { reader ->
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
                new SatMetadata(line).save failOnError: true, flush: true
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


    /**
    * 
     0    Uuid, 
     1    RfcEmisor, 
     2    NombreEmisor, 
     3    RfcReceptor, 
     4    NombreReceptor, 
     5    RfcPac, 
     6    FechaEmision, 
     7    FechaCertificacionSat, 
     8    Monto, 
     9    EfectoComprobante, 
     10   Estatus, 
     11   FechaCancelacion
    **/
    def read(Integer ejercicio, Integer mes) {
        
        def count = 0, MAXSIZE = 100
        def dir = new File(metadataDir)
        def file = new File(metadataDir, 'metadata.txt').withReader { reader ->
            String line = reader.readLine()
            line = reader.readLine() // IGnorar los encabezados

            while (line) {
                
                def split = line.split('~')
                def size = split.size()
                def fechaEmision = Date.parse("yyyy-MM-dd HH:mm:ss",split[6]) 
                def ej = Periodo.obtenerYear(fechaEmision)
                def ms = Periodo.obtenerMes(fechaEmision) + 1
                /*
                def data = [
                    uuid: split[0], 
                    emisorRfc: split[1], 
                    emisorNombre: split[2],
                    receptorRfc: split[3],
                    recepctorNombre: split[4],
                    pacRfc: split[5],
                    fechaEmision: split[6],
                    fechaCertificacionSat: split[7],
                    monto: split[8],
                    efectoComprobante: split[9],
                    estatus: split[10],
                    ejercicio: ej,
                    mes: ms
                    ]
                if(size == 12) {
                    data.fechaCancelacion = split[11] 
                }
                */

                if(ms > mes) {
                    break
                }
                new SatMetadata(line).save failOnError: true, flush: true
                line = reader.readLine()
            }
            log.info('Rows: {}', count)
        }

    }

    
}
