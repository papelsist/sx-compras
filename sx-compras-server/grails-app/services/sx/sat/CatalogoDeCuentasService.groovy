package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.util.Environment
import groovy.util.logging.Slf4j
import lx.econta.Mes
import lx.econta.catalogo.Catalogo
import lx.econta.catalogo.CatalogoBuilder
import lx.econta.catalogo.Cuenta
import lx.econta.catalogo.Naturaleza
import org.springframework.beans.factory.annotation.Value
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import sx.contabilidad.CuentaContable
import sx.core.Empresa
import sx.core.LogUser

// @GrailsCompileStatic
@Slf4j
class CatalogoDeCuentasService implements  LogUser, EcontaSupport {

    @Value('${siipapx.econta.xmlDir:user.home}')
    String econtaXmlDir

    @Transactional
    CatalogoDeCuentas generar(EcontaEmpresa emp, Integer ej, Integer m) {
        CatalogoDeCuentas catalogoDeCuentas = CatalogoDeCuentas.where{empresa == emp && ejercicio == ej && mes == m}.find()
        if(!catalogoDeCuentas) {
            catalogoDeCuentas = new CatalogoDeCuentas()
            catalogoDeCuentas.with {
                it.ejercicio = ej
                it.mes = m
                it.emisor = emp.razonSocial
                it.empresa = emp
                it.rfc = empresa.rfc
            }
        }
        Catalogo catalogo = generarCatalogo(emp, ej, m)
        File xmlFile = saveXml(catalogo)
        catalogoDeCuentas.xmlUrl = xmlFile.toURI().toURL()
        catalogoDeCuentas.fileName = xmlFile.getName()
        logEntity(catalogoDeCuentas)
        catalogoDeCuentas = catalogoDeCuentas.save failOnError: true, flush: true
        return catalogoDeCuentas
    }

    Catalogo generarCatalogo(EcontaEmpresa empresa, Integer ej, Integer m) {
        List cuentas = readData(empresa, empresa.sqlCatalogo)
        Catalogo catalogo = new Catalogo(
                rfc: empresa.rfc,
                certificado:empresa.certificado,
                ejercicio:ej,
                mes:getMes(m),
                )
        catalogo.cuentas = []
        cuentas.each { row ->
            Cuenta cta = new Cuenta()
            cta.clave = row['NumCta']
            cta.descripcion = row['Desc']
            cta.condigo = row['CodAgrup']
            cta.nivel = row['Nivel'] as Integer
            cta.naturaleza = row['Natur'] == 'DEUDORA' ? Naturaleza.DEUDORA : Naturaleza.ACREDORA
            if(cta.nivel > 1)
                cta.subcuentaDe = row['SubCtaDe']
            catalogo.cuentas.add(cta)
        }
        return catalogo
    }

    @Transactional
    File saveXml(Catalogo catalogo) {
        CatalogoBuilder builder = CatalogoBuilder.newInstance()
        String xmlString = builder.build(catalogo)
        File target = new File(getXmlDirectory(), CatalogoBuilder.getSatFileName(catalogo))
        target.setText(xmlString, 'UTF-8')
        return target
    }

    File getXmlDirectory() {
        String filePath = "${this.econtaXmlDir}/catalogos"
        File dir = new File(filePath)
        if(!dir.exists()) {
            dir.mkdirs()
        }
        return dir
    }

    @Transactional
    CatalogoDeCuentas saveAcuse(EcontaUploadCommand command) {
        CatalogoDeCuentas cat = CatalogoDeCuentas.get(command.documento)
        String fileName = "${cat.fileName.replaceAll(".xml", '')}_ACU_" + command.file.originalFilename
        File target = new File(getXmlDirectory(), fileName)
        command.file.transferTo(target)
        cat.acuseUrl = target.toURI()
        return cat
    }

    /*String getFileName(CatalogoDeCuentas catalogo) {
        String smes = catalogo.mes.toString().padLeft(2, '0')
        return "${catalogo.rfc}${catalogo.ejercicio}${smes}CT.xml"
    }*/

}

