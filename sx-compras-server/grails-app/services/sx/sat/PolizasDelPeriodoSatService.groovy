package sx.sat

import groovy.util.logging.Slf4j
import lx.econta.CadenaBuilder
import lx.econta.Mes
import lx.econta.SatMoneda
import lx.econta.polizas.Cheque
import lx.econta.polizas.ComprobanteNacional
import lx.econta.polizas.PolizasBuilder
import lx.econta.polizas.SatPoliza
import lx.econta.polizas.SatPolizaDet
import lx.econta.polizas.SatPolizas
import lx.econta.polizas.TipoSolicitud
import org.bouncycastle.util.encoders.Base64
import org.springframework.beans.factory.annotation.Value
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.core.Empresa
import sx.core.LogUser

@Slf4j
class PolizasDelPeriodoSatService implements  LogUser, SelladorDigital{

    @Value('${siipapx.econta.polizasDir}')
    String econtaPolizasDir

    PolizasDelPeriodoSat save(PolizasDelPeriodoSat polizas) {
        logEntity(polizas)
        log.debug("Salvando balanza sat {}", polizas)
        polizas.save failOnError: true, flush: true
    }

    PolizasDelPeriodoSat generar(PolizasDelPeriodoSat polizas) {
        Empresa empresa = Empresa.first()
        polizas.rfc = empresa.rfc
        polizas.emisor = empresa.nombre
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


        List<Poliza>  polizas = Poliza.where{ejercicio == polizasPer.ejercicio && mes == polizasPer.mes}
                .list()
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

                registrarComprobantes(det, t)
                registrarComplementosDePago(det, t)

                satPoliza.transacciones.add(det)
            }
            satPolizas.polizas.add(satPoliza)

        }
        PolizasBuilder builder = PolizasBuilder.newInstance()
        String xmlString = builder.buildXml(satPolizas)

        sellarDocumento(satPolizas, empresa, CadenaBuilder.Tipo.POLIZAS, xmlString.getBytes('UTF-8'))
        String signedXml = builder.buildXml(satPolizas)

        polizasPer.fileName = PolizasBuilder.getSatFileName(satPolizas)

        File target = new File(getPolizasDir(), polizasPer.fileName)
        target.write(signedXml, 'UTF-8')

        // polizasPer.xml =  target.toURI().to// signedXml.getBytes('UTF-8')


        return polizasPer
    }

    /**
     * Registra en el XML los comprobantes nacionales
     *
     * @param det
     * @param polizaDet
     * @return
     */
    def registrarComprobantes(SatPolizaDet det, PolizaDet polizaDet) {
        if(polizaDet.uuid) {
            // log.info('Comprobante nacional para : {}', polizaDet.uuid)
            ComprobanteNacional n = ComprobanteNacional.builder()
                    .rfc(polizaDet.rfc)
                    .montoTotal(polizaDet.montoTotal)
                    .uuidcfdi(polizaDet.uuid)
                    .build()
            if(polizaDet.tipCamb > 1.00) {
                n.moneda = SatMoneda.USD
                n.tipCamb = polizaDet.tipCamb
            }
            det.comprobanteNacional.add(n)

        }
    }

    /**
     * Registra en el XML los complementos de Pago
     *
     * @param det
     * @param polizaDet
     * @return
     */
    def registrarComplementosDePago(SatPolizaDet det, PolizaDet polizaDet) {
        polizaDet.cheques.each {
            Cheque cheque = Cheque
                    .builder()
            .build()
            det.cheques.add(cheque)
        }
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

    private File polizasDir

    File getPolizasDir() {
        if(!polizasDir) {
            polizasDir = new File(this.econtaPolizasDir)
            if(!polizasDir.exists())
                polizasDir.mkdir()
        }
        return polizasDir
    }

    File findXmlFile(PolizasDelPeriodoSat p) {
        return new File(getPolizasDir(), p.getFileName())
    }

    String readXml(PolizasDelPeriodoSat p) {
        File xmlFile = findXmlFile(p)
        return xmlFile.getText('UTF-8')
    }

}
