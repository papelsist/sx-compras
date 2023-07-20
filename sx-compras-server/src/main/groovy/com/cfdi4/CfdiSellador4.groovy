package com.cfdi4

import groovy.util.logging.Slf4j

import java.security.Signature

import org.bouncycastle.util.encoders.Base64

import sx.core.Empresa
import com.cfdi4.comprobante.Comprobante

@Slf4j
public class CfdiSellador4 {


    String algoritmo = 'SHA256withRSA'

    // CfdiCadenaBuilder33 cadenaBuilder = new CfdiCadenaBuilder33()
    CfdiCadenaBuilder4 cfdiCadenaBuilder4 

    private Signature signature

    Comprobante sellar(Comprobante comprobante, Empresa empresa){
        log.debug('Sellando comprobante: {}', comprobante.folio)
        String cadenaOriginal = cfdiCadenaBuilder4.build(comprobante)

        final byte[] input=cadenaOriginal.getBytes("UTF-8")
        getSignature(empresa).update(input)
        Signature signature=Signature.getInstance(algoritmo,"BC");
        signature.initSign(empresa.privateKey)
        signature.update(input)

        final byte[] signedData=signature.sign()
        final byte[] encoedeData=Base64.encode(signedData)
        String sello = new String(encoedeData,"UTF-8")
        log.debug('Sello generado  {}', sello)
        comprobante.sello = sello
        return comprobante
    }

    Signature getSignature(Empresa empresa) {
        if (! signature) {
            this.signature = Signature.getInstance(algoritmo,"BC");
            signature.initSign(empresa.privateKey)
        }
        return signature

    }


}