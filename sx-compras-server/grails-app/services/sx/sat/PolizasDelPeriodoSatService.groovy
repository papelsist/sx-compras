package sx.sat

import groovy.util.logging.Slf4j
import lx.econta.CadenaBuilder
import lx.econta.Mes
import lx.econta.polizas.PolizasBuilder
import lx.econta.polizas.SatPoliza
import lx.econta.polizas.SatPolizaDet
import lx.econta.polizas.SatPolizas
import lx.econta.polizas.TipoSolicitud
import org.bouncycastle.util.encoders.Base64
import sx.contabilidad.Poliza

import sx.core.Empresa
import sx.core.LogUser

@Slf4j
class PolizasDelPeriodoSatService implements  LogUser, SelladorDigital{

    PolizasDelPeriodoSat save(PolizasDelPeriodoSat polizas) {
        logEntity(polizas)
        log.debug("Salvando balanza sat {}", polizas)
        polizas.save failOnError: true, flush: true
    }

    PolizasDelPeriodoSat generar(Integer eje, Integer m, String numTramite = '', String numOrden = '') {
        PolizasDelPeriodoSat polizas = new PolizasDelPeriodoSat(ejercicio: eje, mes: m)
        Empresa empresa = Empresa.first()
        polizas.rfc = empresa.rfc
        polizas.emisor = empresa.nombre
        polizas.tipoDeSolicitud = TipoSolicitud.COMPENSACION  // TODO QUITAR
        polizas.numTramite = numTramite
        polizas.numOrden = numOrden
        buildXml(polizas)
    }


    def buildXml(PolizasDelPeriodoSat polizasPer) {
        Empresa empresa = Empresa.first()

        SatPolizas satPolizas =  SatPolizas.builder()
        .ejercicio(polizasPer.ejercicio)
        .mes(Mes.valueOf(polizasPer.mes))
        .rfc(polizasPer.rfc)
        .build()

        satPolizas.numOrden = polizasPer.numOrden
        satPolizas.numTramite = polizasPer.numTramite
        satPolizas.tipoSolicitud = polizasPer.tipoDeSolicitud
        satPolizas.polizas = []


        List<Poliza>  polizas = Poliza.where{ejercicio == polizasPer.ejercicio && mes == polizasPer.mes}.list()
        polizas.each { p ->

            SatPoliza satPoliza = SatPoliza.builder()
            .concepto(p.concepto)
            .numUnIdenPol("${p.subtipo} ${p.folio}")
            .build()
            satPoliza.fechaDePoliza = p.fecha
            satPoliza.transacciones = []

            p.partidas.each { t ->
                SatPolizaDet det = SatPolizaDet.builder()
                        .concepto(t.concepto)
                .cuenta(t.cuenta.clave)
                .descripcion(t.cuenta.descripcion)
                .debe(t.debe)
                .haber(t.haber)
                .build()
                satPoliza.transacciones.add(det)
            }
            satPolizas.polizas.add(satPoliza)

        }
        PolizasBuilder builder = PolizasBuilder.newInstance()
        String xmlString = builder.buildXml(satPolizas)

        sellarDocumento(satPolizas, empresa, CadenaBuilder.Tipo.POLIZAS, xmlString.getBytes('UTF-8'))
        String signedXml = builder.buildXml(satPolizas)

        polizasPer.xml = signedXml.getBytes('UTF-8')
        polizasPer.fileName = PolizasBuilder.getSatFileName(satPolizas)
        return polizasPer
    }

    def sellarDocumento(SatPolizas documento, Empresa empresa, CadenaBuilder.Tipo tipo, byte[] data){

        documento.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        documento.setCertificado(new String(encodedCert))
        // Generar el sello digital y anexar el certificado
        String sello = buildSelloDigital(tipo, data)
        documento.sello = sello
        return documento

    }

}
