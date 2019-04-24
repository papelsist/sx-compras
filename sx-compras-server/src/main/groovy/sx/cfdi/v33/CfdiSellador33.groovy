package sx.cfdi.v33

import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j
import lx.cfdi.v33.Comprobante
import org.bouncycastle.util.encoders.Base64
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.core.Empresa

import java.security.Signature

@Slf4j
@GrailsCompileStatic
@Component
class CfdiSellador33 {


	String algoritmo = 'SHA256withRSA'

	@Autowired
	@Qualifier('cfdiCadenaBuilder33')
	CfdiCadenaBuilder33 cadenaBuilder

	private Signature signature

	Comprobante sellar(Comprobante comprobante, Empresa empresa){
		// log.debug('Sellando comprobante: {}', comprobante.folio)
		String cadenaOriginal = cadenaBuilder.build(comprobante)

		final byte[] input=cadenaOriginal.getBytes("UTF-8")
		getSignature(empresa).update(input)
		Signature signature=Signature.getInstance(algoritmo,"BC");
		signature.initSign(empresa.privateKey)
		signature.update(input)

		final byte[] signedData=signature.sign()
		final byte[] encoedeData=Base64.encode(signedData)
		String sello = new String(encoedeData,"UTF-8")
		log.debug('Sello digital generado  OK')
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