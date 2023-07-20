package com.cfdi4

import groovy.util.slurpersupport.GPathResult
import groovy.xml.XmlUtil
import org.apache.commons.io.FileUtils

import javax.xml.bind.JAXBContext



import sx.cfdi.Cfdi
import com.cfdi4.comprobante.Comprobante
import com.cfdi4.catalogos.CMoneda

import sx.utils.MonedaUtils


class V4CfdiUtils {

	static Comprobante toComprobante(Cfdi cfdi){
    File file = FileUtils.toFile(cfdi.url)
    Comprobante comprobante = Cfdi4Utils.read(file.bytes)
    return comprobante
	}

    static List getPartidas(Cfdi cfdi) {
        Comprobante comprobante = Cfdi4Utils.read(cfdi.url.bytes)
        comprobante.getConceptos().concepto
    }

  static String parse(byte[] xmlData){
    ByteArrayInputStream is=new ByteArrayInputStream(xmlData)
    GPathResult xmlResult = new XmlSlurper().parse(is)
    return XmlUtil.serialize(xmlResult)
  }

	static getMonedaCode(Currency moneda){
		if(moneda == MonedaUtils.PESOS) 
			return CMoneda.MXN
		else 
			return CMoneda.USD
	}

}