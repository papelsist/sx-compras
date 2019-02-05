package sx.sat

import lx.econta.ContaUtils
import lx.econta.Mes
import lx.econta.catalogo.Catalogo
import lx.econta.catalogo.CatalogoBuilder
import lx.econta.catalogo.Cuenta
import lx.econta.catalogo.Naturaleza
import sx.contabilidad.CuentaContable
import sx.core.Empresa
import sx.core.LogUser

class CatalogoDeCuentasService implements  LogUser{

    CatalogoDeCuentas generar(Integer eje, Integer m) {
        Empresa empresa = Empresa.first()
        CatalogoDeCuentas catalogo = CatalogoDeCuentas.where{ejercicio == eje && mes == m}.find()
        if(!catalogo) {
            catalogo = new CatalogoDeCuentas()
            catalogo.with {
                ejercicio = eje
                it.mes = m
                emisor = empresa.nombre
                rfc = empresa.rfc
            }
        }
        catalogo.xml = generarXml(eje, m, empresa).getBytes('UTF-8')
        catalogo.fileName = getFileName(catalogo)
        return catalogo
    }

    CatalogoDeCuentas save(CatalogoDeCuentas cta) {
        logEntity(cta)
        cta.save failOnError: true, flush: true
    }


    def generarXml(Integer ejercicio, Integer mes, Empresa empresa = Empresa.first()) {
        List<CuentaContable> cuentas = CuentaContable.list()
        Mes emes = getMes(mes)
        Catalogo catalogo = new Catalogo('1.3', empresa.rfc, ejercicio, emes, empresa.numeroDeCertificado)
        catalogo.cuentas = []
        cuentas.each {
            Cuenta cta = new Cuenta(it.cuentaSat.codigo, it.clave, it.descripcion)
            cta.nivel = it.nivel
            cta.naturaleza = it.naturaleza == 'DEUDORA' ? Naturaleza.DEUDORA : Naturaleza.ACREDORA
            if(it.padre)
                cta.subcuentaDe = it.padre.clave
            catalogo.cuentas.add(cta)
        }
        CatalogoBuilder builder = CatalogoBuilder.newInstance()
        String xmlString = builder.build(catalogo)
        return xmlString
    }

    def getFileName(CatalogoDeCuentas catalogo) {

        return "${catalogo.rfc}${catalogo.ejercicio}${catalogo.mes.value}CT.xml"
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
