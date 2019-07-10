package sx.contabilidad

import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import groovy.transform.Canonical
import groovy.transform.ToString
import org.apache.commons.lang3.exception.ExceptionUtils
import java.sql.SQLException
import sx.utils.Periodo
import groovy.util.logging.Slf4j

@Slf4j
@Transactional
class DiotService {

    def dataSource

    def generarDiot(Periodo periodo) {
       log.info("Generando diot para {}",periodo)    

        def sql = new Sql(dataSource)

        def fechaInicial = periodo.fechaInicial.format('yyyy-MM-dd')
        def fechaFinal = periodo.fechaFinal.format('yyyy-MM-dd')
        def select = getSelect().replaceAll('@FECHA_INICIAL', fechaInicial).replaceAll('@FECHA_FINAL', fechaFinal)
        def rows = sql.rows(select)
        List<Diot> diots = [] 
        rows.each{ row ->
            println row
            def diot = new Diot(row)
    	    diot.save failOnError: true, flush:true
            diots.add(diot)
        }

        return diots
        
    }

    def layout(int mes, int ejercicio) {

        def temp = File.createTempFile("temp",".txt",null)
        def rows = Diot.where{mes == mes && ejercicio == ejercicio}

        println temp

        temp.with{
            rows.each{ row ->
                if(row.pagos1516 > 50000){
                    def rowFile ="""${row.tipoTercero}|${row.tipoOperacion}|${row.rfc}|${row.idFiscal}|${row.nombreExtranjero}|${row.paisResidencia}|${row.nacionalidad}|${row.pagos1516}|${row.pagos15}
                    |${row.ivaPagado1516}|${row.pagos1011}|${row.pagos10}|${row.pagosFrontera}|${row.ivaPagado1011}|${row.ivaPagadoFrontera}|${row.pagosImportacion}|${row.ivaPagadoImportacion1516}
                    |${row.pagosImportacion1011}|${row.ivaPagadoImportacion1011}|${row.pagosImportacionSinIva}|${row.pagosTasa0}|${row.pagosSinIva}|${row.ivaRetenidoContribuyente}|${row.ivaNotas}"""
            
                    append(rowFile)
                }
            }
        }
        def generales = Diot.where {pagos1516 < 50000}.list() //.sum{it.pagos1516}

    }


    def getSelect(){
        def select = """ 
                SELECT year('@FECHA_INICIAL') ejercicio,month('@FECHA_INICIAL') mes,'04' tipoTercero
                ,case when B.RFC  IN('BER830101IQ4','ICS050919728','ICP760402388','ISL7406175K7','SIN000114UV0') then '06' else '85' end tipoOPeracion
                ,proveedor,rfc,'' idFiscal,'' nombreExtranjero,'' paisResidencia,'' nacionalidad 
                ,SUM(B.baseCalculada) pagos1516,0 pagos15,0 ivaPagado1516,0 pagos1011,0 pagos10,0 pagosFrontera,0 ivaPagado1011,0 ivaPagadoFrontera
                ,0 pagosImportacion,0 ivaPagadoImportacion1516,0 ivaPagadoImportacion1011,0 pagosImportacion1011,0 pagosimportacionSinIva
                ,SUM(B.tasaCero) pagosTasa0,SUM(B.exento) pagosSinIva,SUM(B.ivaRetenido) ivaRetenidoContribuyente,SUM(B.ivaNota) ivaNotas,SUM(B.ivaAcreditable) ivaAcreditable,SUM(B.ivaAnticipo) ivaAnticipo
                FROM (
                SELECT A.proveedor,CASE WHEN A.RFC IS NULL THEN (SELECT P.RFC FROM PROVEEDOR P WHERE (A.PROVEEDOR=P.NOMBRE)) ELSE A.RFC END rfc
                ,SUM(CASE WHEN A.CUENTA LIKE '119-%'  THEN -(A.DEBE-A.HABER) ELSE 0 END) AS ivaNota
                ,SUM(CASE WHEN A.CUENTA LIKE '118-%' AND A.CUENTA_ID NOT IN(1266,1263,1268) THEN A.DEBE-A.HABER ELSE 0 END) AS ivaAcreditable
                ,SUM(CASE WHEN A.CUENTA LIKE '118-%' AND A.CUENTA_ID  IN(1266) THEN A.DEBE-A.HABER ELSE 0 END) AS ivaRetenido
                ,SUM(CASE WHEN A.CUENTA LIKE '118-%' AND A.CUENTA_ID  IN(1263) THEN A.DEBE-A.HABER ELSE 0 END) AS ivaAnticipo
                ,SUM(CASE WHEN A.CUENTA LIKE '118-%' THEN A.BASE_CALCULADA ELSE 0 END) AS baseCalculada
                ,0 AS exento,0 tasaCero
                FROM (
                SELECT case when PD.DOCUMENTO_TIPO='CON' AND PD.ASIENTO LIKE '%COMISION%TARJ%' AND PD.REFERENCIA like '%AMEX%' THEN 'AMERICAN EXPRESS COMPANY MEXICO SA DE CV' when PD.DOCUMENTO_TIPO='CON' AND PD.ASIENTO LIKE '%COMISION%TARJ%' AND PD.REFERENCIA NOT like '%AMEX%' THEN 'BANCO NACIONAL DE MEXICO SA' ELSE PD.REFERENCIA END AS PROVEEDOR
                ,PD.RFC,P.TIPO,P.SUBTIPO,PD.CUENTA_ID,T.CLAVE AS CUENTA,T.DESCRIPCION AS CTA_DESCRIPCION,P.FOLIO AS POLIZA,P.FECHA,PD.DEBE,PD.HABER,CASE WHEN T.CLAVE LIKE '118%' THEN ROUND(PD.DEBE/0.16,2) ELSE PD.DEBE END AS BASE_CALCULADA,PD.ASIENTO
                FROM poliza P JOIN poliza_det PD ON(P.ID=PD.POLIZA_ID) JOIN cuenta_contable T ON(T.ID=PD.CUENTA_ID)
                WHERE P.FECHA BETWEEN '@FECHA_INICIAL' and '@FECHA_FINAL' AND (T.CLAVE LIKE '118-%' OR ( T.CLAVE LIKE '119-%' AND P.subtipo='DESCUENTOS_COMPRAS'))
                ORDER BY P.subtipo,t.clave,T.descripcion,PD.ASIENTO
                ) AS A
                GROUP BY A.PROVEEDOR
                union
                SELECT a.proveedor,a.rfc,0 ivaNotas,0 iva_acred,0 iva_ret,0 iva_ant,0 base_calculada
                ,sum(case when a.rfc in('HERA730616NT0','BON9206241N5','MAGD780430657','ELE9012281G2','ROBG7004078W5','TERJ580319HK5') then 0 else dif_exenta end) exento
                ,sum(case when a.rfc in('HERA730616NT0','BON9206241N5','MAGD780430657','ELE9012281G2','ROBG7004078W5','TERJ580319HK5') then dif_exenta else 0 end) tasaCero
                FROM (
                select p.nombre proveedor,p.rfc,(c.sub_total-(case when p.rfc='GPO8712052S1' and c.fecha<'@FECHA_INICIAL' then 0 else c.descuento end))-ROUND(c.impuesto_trasladado/0.16,2) dif_exenta
                FROM movimiento_de_cuenta m join requisicion r on(r.egreso=m.id) join requisicion_det d on(d.requisicion_id=r.id) 
                join cuenta_por_pagar c on(d.cxp_id=c.id) join proveedor p on(c.proveedor_id=p.id)
                where m.fecha BETWEEN '@FECHA_INICIAL' and '@FECHA_FINAL'  AND P.RFC NOT IN('GDF9712054NA') 
                AND round(c.impuesto_trasladado*100/(c.sub_total-(case when p.rfc='GPO8712052S1' and c.fecha<'@FECHA_INICIAL'  then 0 else c.descuento end)),2) NOT BETWEEN 15.95 AND 16.05 
                union
                select p.nombre,p.rfc,(c.sub_total-c.descuento)-ROUND(c.impuesto_trasladado/0.16,2) dif_exenta
                FROM movimiento_de_cuenta m join rembolso r on(r.egreso_id=m.id) join rembolso_det d on(d.rembolso_id=r.id) 
                join cuenta_por_pagar c on(d.cxp_id=c.id) join proveedor p on(c.proveedor_id=p.id)
                where m.fecha BETWEEN '@FECHA_INICIAL' and '@FECHA_FINAL' AND round(c.impuesto_trasladado*100/(c.sub_total-c.descuento),2) NOT BETWEEN 15.95 AND 16.05  
                AND R.cuenta_contable_id not in(2887,2888,2889,2890,2891) AND P.RFC NOT IN('GDF9712054NA')
                ) as a group by a.proveedor
                ) B GROUP BY B.PROVEEDOR
                ORDER BY 11 DESC,24 DESC,25 DESC
        """
        return select
    }
}
