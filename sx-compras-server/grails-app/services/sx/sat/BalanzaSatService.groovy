package sx.sat

import groovy.util.logging.Slf4j
import lx.econta.CadenaBuilder
import lx.econta.Mes
import lx.econta.balanza.Balanza
import lx.econta.balanza.BalanzaBuilder
import lx.econta.balanza.BalanzaDet
import org.bouncycastle.util.encoders.Base64
import sx.contabilidad.SaldoPorCuentaContable
import sx.core.Empresa
import sx.core.LogUser

@Slf4j
class BalanzaSatService implements  LogUser, SelladorDigital{

    BalanzaSat save(BalanzaSat balanza) {
        logEntity(balanza)
        log.debug("Salvando balanza sat {}", balanza)
        balanza.save failOnError: true, flush: true
    }

    BalanzaSat generar(Integer eje, Integer m) {
        BalanzaSat balanzaSat = BalanzaSat.where{ejercicio == eje && mes == m}.last()

        if(!balanzaSat) {
            balanzaSat = generarBalanzaNormal(eje, m)

        } else if(balanzaSat.acuse) {
            balanzaSat = generarBalanzaComplementaria(eje, m)  // Generar complementaria
        }
        buildXml(balanzaSat)
    }

    private BalanzaSat generarBalanzaNormal(Integer eje, Integer m) {
        BalanzaSat balanzaSat = new BalanzaSat(ejercicio: eje, mes: m)
        balanzaSat.tipo = 'N'

        log.info("Balanza Normal 2: {}", balanzaSat)
        return balanzaSat
    }

    private BalanzaSat generarBalanzaComplementaria(Integer eje, Integer m) {
        BalanzaSat balanzaSat = new BalanzaSat(ejercicio: eje, mes: m)
        balanzaSat.tipo = 'C'
        balanzaSat.ultimaModificacion = calcularUltimaModificacion(balanzaSat)
        return balanzaSat
    }


    def buildXml(BalanzaSat balanzaSat) {
        Empresa empresa = Empresa.first()

        Balanza balanza =  Balanza.builder()
        .ejercicio(balanzaSat.ejercicio)
        .mes(Mes.valueOf(balanzaSat.mes))
        .rfc(empresa.rfc)
        .tipoDeEnvio(balanzaSat.tipo)
        .build()

        List<SaldoPorCuentaContable> saldos = SaldoPorCuentaContable
                .where {ejercicio == balanzaSat.ejercicio && mes == balanzaSat.mes && cuenta.padre == null}.list()
        saldos.each {
            balanza.partidas.add(new BalanzaDet(it.clave, it.saldoInicial, it.debe, it.haber, it.saldoFinal))
        }

        BalanzaBuilder builder = BalanzaBuilder.newInstance()
        String xmlString = builder.buildXml(balanza)

        sellarDocumento(balanza, empresa, CadenaBuilder.Tipo.BALANZA, xmlString.getBytes('UTF-8'))
        String signedXml = builder.buildXml(balanza)

        balanzaSat.xml = signedXml.getBytes('UTF-8')
        balanzaSat.fileName = BalanzaBuilder.getSatFileName(balanza)
        return balanzaSat
    }

    def sellarDocumento(Balanza documento, Empresa empresa, CadenaBuilder.Tipo tipo, byte[] data){
        documento.setNoCertificado(empresa.numeroDeCertificado)
        byte[] encodedCert=Base64.encode(empresa.getCertificado().getEncoded())
        documento.setCertificado(new String(encodedCert))
        // Generar el sello digital y anexar el certificado
        String sello = buildSelloDigital(tipo, data)
        documento.sello = sello
        return documento

    }



    Date calcularUltimaModificacion(BalanzaSat bz) {
        SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .where{ ejercicio == bz.ejercicio && mes == bz.mes && cuenta.padre == null}.last()
        if(saldo)
            return saldo.lastUpdated
        return null
    }




}
