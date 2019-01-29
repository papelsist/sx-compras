package sx.sat

import groovy.util.logging.Slf4j
import lx.econta.CadenaBuilder
import org.bouncycastle.util.encoders.Base64
import sx.core.Empresa

import java.security.Signature

@Slf4j
trait SelladorDigital {

    String algoritmo = 'SHA256withRSA'

    private Signature signature
    private CadenaBuilder cadenaBuilder

    String buildSelloDigital(CadenaBuilder.Tipo tipo , byte[] data, Empresa empresa = Empresa.first()){
        log.debug('Sellando comprobante {}', tipo)

        String cadenaOriginal = getCadenaBuilder().getCadena(data, tipo)

        final byte[] input=cadenaOriginal.getBytes("UTF-8")

        Signature signature = Signature.getInstance(algoritmo,"BC")
        signature.initSign(empresa.privateKey)
        signature.update(input)

        final byte[] signedData = signature.sign()
        final byte[] encoedeData = Base64.encode(signedData)
        String sello = new String(encoedeData,"UTF-8")
        return sello
    }



    CadenaBuilder getCadenaBuilder() {
        if(!cadenaBuilder)
            cadenaBuilder = CadenaBuilder.newInstance()
        return cadenaBuilder
    }

}