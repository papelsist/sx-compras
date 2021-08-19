package sx.sat

import groovy.util.logging.Slf4j
import sx.sat.SatMetadataProveedor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier


import groovy.io.FileType

import org.springframework.beans.factory.annotation.Value
import groovy.sql.Sql
import sx.utils.Periodo
import sx.cxp.CuentaPorPagar 
import sx.cxp.RequisicionDet
import sx.cxp.RembolsoDet
import  sx.sat.SatMetadataProveedor

@Slf4j
class SatMetadataProveedorService {

    @Value('${siipapx.sat.metadata}')
    String metadataDir


    @Autowired
    @Qualifier('dataSource')
    def dataSource


        
    String metaDataFileName = 'metadata.txt'

    def registrosDelPeriodo(Integer ej, Integer ms){
        return SatMetadataProveedor
        .where{ejercicio == ej && mes == ms}
        .list([sort: 'fechaEmision', order: 'asc'])
    }

    def importar() {
        log.info('Importando metadata para Proveedores ')
        String df = 'yyyy-MM-dd HH:mm:ss'
        def count = 0
        def directory = new File("${metadataDir}/proveedores")
        println "****** ${directory} ******"
        if(directory.isDirectory()){
            directory.eachFile(FileType.FILES) {file ->
                if(file.name.contains('.txt')){
                    println "****** ${file.name} ******"
                    file.each{line ->
                       if(!line.contains('Uuid')){
                            def split = line.split('~')
                            def size = split.size()
                            def fechaEmision = Date.parse(df,split[6]) 
                            def ej = Periodo.obtenerYear(fechaEmision)
                            def ms = Periodo.obtenerMes(fechaEmision) + 1
                            println line
                            def registro = SatMetadataProveedor.findOrCreateByUuid(split[0])
                            if(!registro.id){
                                def data = [
                                            uuid: split[0], 
                                            emisorRfc: split[1], 
                                            receptorRfc: split[3],
                                            pacRfc: split[5],
                                            fechaEmision: Date.parse(df, split[6]),
                                            fechaCertificacionSat: Date.parse(df, split[7]),
                                            monto: new BigDecimal(split[8]),
                                            efectoComprobante: split[9],
                                            estatus: split[10]
                                        ]
                                if(size == 12) {
                                    registro.fechaCancelacion = Date.parse(df, split[11]) 
                                }
                                registro.properties = data
                                registro.recepctorNombre = split[4]?: 'PAPEL SA DE CV'
                                registro.emisorNombre= split[2]?: 'N/A'
                                registro.ejercicio = Periodo.obtenerYear(fechaEmision)
                                registro.mes = Periodo.obtenerMes(registro.fechaEmision) + 1      
                                println "Registro"
                                println registro
                                registro.save failOnError: true, flush: true
                            } 
                       }
                    }
                }
                file.delete()
            }
        }
    }
    
    def validar(Integer ejercicio, Integer mes){
        println  "Validando el ejercicio ${ejercicio} - ${mes}"
        def query = """
            SELECT *,
            case when c.comprobante_id is not null and S.fecha_cancelacion  is not null then 'CANCELADO' 
            when c.comprobante_id  is null then 'FALTANTE' END AS 'aclaracion'
            FROM  sat_metadata_proveedor s left join 
            (SELECT id as comprobante_id,uuid as comprobante_uuid ,fecha, proveedor_id,tipo FROM siipapx.comprobante_fiscal) as c  on(c.comprobante_uuid=s.uuid)
            where ejercicio = ? and mes = ?
        """
        def sql = new Sql(dataSource)
        def rows = sql.rows(query,[ejercicio,mes])
        rows.each{row ->
                def aclaracion = row.aclaracion
                def metaData = SatMetadataProveedor.get(row.id)
                if(row.comprobante_id){
                    def cxp = CuentaPorPagar.find("from CuentaPorPagar c where  c.comprobanteFiscal.id = ?",[row.comprobante_id])
                    if(!cxp && row.tipo == "I" ){   
                        aclaracion = aclaracion ?: "INCOMPLETO"            
                    }
                    if(cxp){  
                        if(cxp.tipo == 'COMPRAS'){
                            def requisicionDet = RequisicionDet.findByCxp(cxp)
                            if(!requisicionDet || !requisicionDet.requisicion.egreso){
                                aclaracion = aclaracion ? "${aclaracion} - SIN PAGOS": "SIN PAGOS"
                            }
                            if(aclaracion && requisicionDet && requisicionDet.requisicion.egreso){
                                aclaracion = "${aclaracion} - PAGADO"
                            }  
                            if(requisicionDet){
                                def egreso = requisicionDet.requisicion.egreso
                               if(egreso){
                                    metaData.formaDePago = egreso.formaDePago
                                    metaData.referencia = egreso.referencia
                                    metaData.fechaPago = egreso.fecha
                               }
                            }
                            
                        }
                        if(cxp.tipo == 'GASTOS'){
                            def rembolsoDet = RembolsoDet.findByCxp(cxp)
                            if(!rembolsoDet || !rembolsoDet.rembolso.egreso){
                                aclaracion = aclaracion ? "${aclaracion} - SIN PAGOS": "SIN PAGOS"
                            }
                            if(aclaracion && rembolsoDet && rembolsoDet.rembolso.egreso){
                                    aclaracion = "${aclaracion} - PAGADO"
                            }
                            if(rembolsoDet){
                                def egreso = rembolsoDet.rembolso.egreso
                               if(egreso){
                                    metaData.formaDePago = egreso.formaDePago
                                    metaData.referencia = egreso.referencia
                                    metaData.fechaPago = egreso.fecha
                               }
                            }
        
                        }
                        metaData.tc = cxp.tipoDeCambio 
                        metaData.ivaRetenido = cxp.impuestoRetenidoIva
                        metaData.total = cxp.total
                        metaData.isrRetenido = cxp.impuestoRetenidoIsr
                        metaData.moneda = cxp.moneda
                        metaData.origen = cxp.tipo
                        metaData.iva = cxp.impuestoTrasladado
                        metaData.subtotal = cxp.subTotal
                    }
                }
                if(aclaracion){
                    metaData.aclaracion = aclaracion
                    metaData.save failOnError: true, flush: true
                }
        }
    }

    def eliminarRegistros(Integer ejercicio, Integer mes) {
        /* def deleted = SatMetadata
        .executeUpdate('delete from SatMetadata where ejercicio = ? and mes = ?', ejercicio, mes)
        log.info('Registros eliminados: {}', deleted) */
    }
    
}
