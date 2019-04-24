package sx.cfdi

import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Value

import grails.gorm.transactions.Transactional

import lx.cfdi.v33.CfdiUtils
import lx.cfdi.v33.Comprobante
import lx.cfdi.v33.pagos.PagosUtils
import sx.core.LogUser
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Transactional
class CfdiService implements  LogUser{

    @Value('${siipapx.cfdi.dir}')
    String cfdisDir

    ReportService reportService

    Cfdi generarCfdi(Comprobante comprobante, String tipo, String origen) {
        Cfdi cfdi = new Cfdi()
        cfdi.tipoDeComprobante = tipo
        cfdi.fecha = Date.parse( "yyyy-MM-dd'T'HH:mm:ss", comprobante.fecha,)
        cfdi.serie = comprobante.serie
        cfdi.folio = comprobante.folio
        cfdi.emisor = comprobante.emisor.nombre
        cfdi.emisorRfc = comprobante.emisor.getRfc()
        cfdi.receptor = comprobante.receptor.nombre
        cfdi.receptorRfc = comprobante.receptor.rfc
        cfdi.total = comprobante.total
        cfdi.origen = origen
        cfdi.fileName = "${cfdi.serie}-${cfdi.folio}.xml"

        byte[] data
        if(cfdi.tipoDeComprobante == 'P') {
            data = PagosUtils.toXmlByteArray(comprobante)
        } else {
            data = CfdiUtils.toXmlByteArray(comprobante)
        }
        saveXml(cfdi, data)
        logEntity(cfdi)
        cfdi.save failOnError: true, flush:true
        return cfdi
    }

    void saveXml(Cfdi cfdi, byte[] data){

        Date date = cfdi.fecha
        String year = date[Calendar.YEAR]
        String month = date[Calendar.MONTH] + 1

        def cfdiRootDir = new File(cfdisDir)

        final FileTreeBuilder treeBuilder = new FileTreeBuilder(cfdiRootDir)
        treeBuilder{
            dir(year){
                dir(month){
                    File res = file(cfdi.fileName) {
                        setBytes(data)
                    }
                    cfdi.url = res.toURI().toURL()
                }
            }
        }
    }

}
