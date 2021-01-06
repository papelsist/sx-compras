package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.util.Environment
import lx.econta.Mes
import lx.econta.catalogo.Catalogo
import lx.econta.catalogo.CatalogoBuilder
import lx.econta.catalogo.Cuenta
import lx.econta.catalogo.Naturaleza
import org.springframework.beans.factory.annotation.Value
import org.springframework.transaction.annotation.Transactional
import sx.contabilidad.CuentaContable
import sx.core.Empresa
import sx.core.LogUser

@GrailsCompileStatic
class CatalogoDeCuentasService implements  LogUser {

    @Value('${siipapx.econta.xmlDir:user.home}')
    String econtaXmlDir

    @Transactional
    CatalogoDeCuentas generar(Integer eje, Integer m) {
        Empresa empresa = Empresa.first()
        CatalogoDeCuentas catalogo = CatalogoDeCuentas.where{ejercicio == eje && mes == m}.find()
        if(!catalogo) {
            catalogo = new CatalogoDeCuentas()
            catalogo.with {
                it.ejercicio = eje
                it.mes = m
                it.emisor = empresa.nombre
                it.rfc = empresa.rfc
            }
        }
        Catalogo catalogoSat = generarCatalogoSat(eje, m, empresa.rfc, empresa.numeroDeCertificado)
        File xmlFile = generarXml(catalogoSat)
        catalogo.xmlUrl = xmlFile.toURI().toURL()
        catalogo.fileName = xmlFile.getName()
        return save(catalogo)
    }

    @Transactional
    CatalogoDeCuentas save(CatalogoDeCuentas cta) {
        logEntity(cta)
        cta.save failOnError: true, flush: true
    }

    Catalogo generarCatalogoSat(Integer ejercicio, Integer mes, String rfc, String numeroDeCertificado) {
        List<CuentaContable> cuentas = buscarCuentas(ejercicio, mes)
        Mes emes = getMes(mes)
        Catalogo catalogo = new Catalogo('1.3', rfc, ejercicio, emes, numeroDeCertificado)
        catalogo.cuentas = []
        cuentas.each {
            Cuenta cta = new Cuenta(it.cuentaSat.codigo, it.clave, it.descripcion)
            cta.nivel = it.nivel
            cta.naturaleza = it.naturaleza == 'DEUDORA' ? Naturaleza.DEUDORA : Naturaleza.ACREDORA
            if(it.padre)
                cta.subcuentaDe = it.padre.clave
            catalogo.cuentas.add(cta)
        }
        return catalogo
    }

    /**
     * Regresa el catalogo de cuentas para el ejercio/mes
     * @param ejercicio Año
     * @param mes Mes
     * @return Lista de cuentas contables
     */
    List<CuentaContable> buscarCuentas(Integer ejercicio, Integer mes) {
        return CuentaContable.list()
    }

    File generarXml(Catalogo catalogo) {
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

    String getFileName(CatalogoDeCuentas catalogo) {
        String smes = catalogo.mes.toString().padLeft(2, '0')
        return "${catalogo.rfc}${catalogo.ejercicio}${smes}CT.xml"
    }


    private Mes getMes(Integer v) {
        switch (v) {
            case 1:
                return Mes.ENERO
            case 2:
                return Mes.FEBRERO
            case 3:
                return Mes.MARZO
            case 4:
                return Mes.ABRIL
            case 5:
                return Mes.MAYO
            case 6:
                return Mes.JUNIO
            case 7:
                return Mes.JULIO
            case 8:
                return Mes.AGOSTO
            case 9:
                return Mes.SEPTIEMBRE
            case 10:
                return Mes.OCTUBRE
            case 11:
                return Mes.NOVIEMBRE
            case 12:
                return Mes.DICIEMBRE
            case 13:
                return Mes.TRECE
        }
    }


}
