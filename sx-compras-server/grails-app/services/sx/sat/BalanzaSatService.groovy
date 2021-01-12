package sx.sat

import groovy.util.logging.Slf4j
import lx.econta.CadenaBuilder
import lx.econta.Mes
import lx.econta.balanza.Balanza
import lx.econta.balanza.BalanzaBuilder
import lx.econta.balanza.BalanzaDet

import org.bouncycastle.util.encoders.Base64
import org.springframework.beans.factory.annotation.Value
import org.springframework.transaction.annotation.Transactional


import sx.core.LogUser

@Slf4j
class BalanzaSatService implements  LogUser, EcontaSupport, SelladorDigital{

    @Value('${siipapx.econta.xmlDir:user.home}')
    String econtaXmlDir

    @Transactional
    BalanzaSat generar(EcontaEmpresa emp, Integer ej, Integer m) {
        BalanzaSat balanzaSat = BalanzaSat.where{ empresa == emp && ejercicio == ej && mes == m}.find()

        if(!balanzaSat) {
            balanzaSat = new BalanzaSat()
            balanzaSat.with {
                it.ejercicio = ej
                it.mes = m
                it.emisor = emp.razonSocial
                it.empresa = emp
                it.rfc = empresa.rfc
                it.tipo = 'N'
            }
        }

        if(balanzaSat.acuseUrl) {
            balanzaSat.tipo = 'C'
        }
        Balanza balanza = generarBalanza(emp, ej, m, balanzaSat.tipo)
        // sellarDocumento(balanza,emp)
        File xmlFile = saveXml(balanza)
        balanzaSat.xmlUrl = xmlFile.toURI().toURL()
        balanzaSat.fileName = xmlFile.getName()

        if(balanzaSat.tipo == 'C')
            balanzaSat.ultimaModificacion = balanza.partidas ? balanza.partidas[0]: null

        logEntity(balanzaSat)
        balanzaSat = balanzaSat.save failOnError: true, flush: true
        return balanzaSat
    }

    Balanza generarBalanza(EcontaEmpresa emp, Integer eje, Integer m, String tipo) {
        Balanza balanza =  Balanza.builder()
                .ejercicio(eje)
                .mes(Mes.valueOf(m))
                .rfc(emp.rfc)
                .tipoDeEnvio(tipo)
                .build()
        if (!emp.sqlBalanza)
            throw new RuntimeException("Falta sentencia SQL para  extraer la balanza")

        // List saldos = readData(emp, emp.sqlBalanza, [eje, m])
        List saldos = getRows(
                getRawSql(emp.dataBaseUrl, emp.username, emp.password),
                emp.sqlBalanza,
                eje, m)
        saldos.each { row ->
            balanza.partidas.add(new BalanzaDet(row))
        }
        BalanzaDet last = saldos.max{it.lastUpdated}
        if(last) {
            log.debug('Ultimia modificación: {}', last.lastUpdated)
            if(balanza.tipoDeEnvio == 'C') {
                balanza.setModificacion(last.lastUpdated)
            }
        }
        return balanza
    }

    @Transactional
    File saveXml(Balanza balanza) {
        String xmlString = BalanzaBuilder.newInstance().buildXml(balanza)
        return BalanzaBuilder.saveToFile(getXmlDirectory(), balanza, xmlString)
    }


    Balanza sellarDocumento(Balanza documento, EcontaEmpresa empresa) {
        if(empresa.getCertificadoDigital()) {
            documento.setNoCertificado(empresa.getCertificado())
            byte[] encodedCert = Base64.encode(empresa.getCertificadoX509().getEncoded())
            documento.setCertificado(new String(encodedCert))
            // Generar el sello digital y anexar el certificado
            String xmlString = BalanzaBuilder.newInstance().buildXml(documento)
            String sello = buildSelloDigital(CadenaBuilder.Tipo.BALANZA, xmlString.getBytes(), empresa)
            documento.sello = sello
        }
        return documento
    }


    File getXmlDirectory() {
        String filePath = "${this.econtaXmlDir}/balanza"
        File dir = new File(filePath)
        if(!dir.exists()) {
            dir.mkdirs()
        }
        return dir
    }

}
