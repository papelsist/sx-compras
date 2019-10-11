package sx.contabilidad

import grails.compiler.GrailsCompileStatic

import grails.gorm.services.Service
import grails.gorm.transactions.NotTransactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.tesoreria.MovimientoDeCuenta

import sx.core.LogUser

@Slf4j
@Service(Poliza)
abstract class PolizaService implements  LogUser{

    abstract  Poliza save(Poliza poliza)

    abstract void delete(Serializable id)

    Poliza salvarPolza(Poliza poliza) {
        if(!poliza.id)
            asignarFolio(poliza)
        logEntity(poliza)
        poliza =  save(poliza)
        return poliza
    }

    @CompileDynamic
    Poliza updatePoliza(Poliza poliza) {
        logEntity(poliza)
        poliza.debe =  poliza.partidas.sum 0.0, {it.debe}
        poliza.haber = poliza.partidas.sum 0.0, {it.haber}

        poliza.partidas.each {
            //it.concepto = it.cuenta.descripcion// concatenar(it.cuenta)
            it.concepto =  concatenar(it.cuenta)
        }
        List<PolizaDet> borrar = poliza.partidas.findAll {it.debe == 0.0 && it.haber == 0.0}
        borrar.each { poliza.removeFromPartidas(it)}
        return save(poliza)
    }

    void asignarFolio(Poliza poliza){
        PolizaFolio folio = PolizaFolio.where {
            ejercicio == poliza.ejercicio && mes == poliza.mes && tipo == poliza.tipo && subtipo == poliza.subtipo
        }.find()
        if(!folio){
            folio = new PolizaFolio(
                    ejercicio: poliza.ejercicio,
                    mes: poliza.mes,
                    tipo: poliza.tipo,
                    subtipo: poliza.subtipo)
            folio.folio = 0
        }
        Integer next = folio.folio + 1
        poliza.folio = next
        folio.folio = next
        folio.save flush: true
    }

    PolizaFolio findFolio(Poliza poliza){
        PolizaFolio folio = PolizaFolio.findOrSaveWhere(
                ejercicio: poliza.ejercicio,
                mes: poliza.mes,
                tipo: poliza.tipo,
                subtipo: poliza.subtipo
        )
        return folio
    }

    @CompileDynamic
    @NotTransactional
    String resolverProcesador(Poliza poliza) {
        /*
        String name = poliza.subtipo.toLowerCase()
                .replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )
        return "${name}Proc"
        */
        return resolverProcesador(poliza.subtipo)

    }

    @CompileDynamic
    @NotTransactional
    String resolverProcesador(String subtipo) {
        String name = subtipo.toLowerCase()
                .replaceAll( "(_)([A-Za-z0-9])", { Object[] it -> it[2].toUpperCase() } )

              return "${name}Proc"
    }

    @NotTransactional
    def concatenar(CuentaContable cta) {
        String cto = cta.descripcion 
      def sucursales = ['OFICINAS','ANDRADE','BOLIVAR','CALLE 4','CF5FEBRERO','SOLIS','VERTIZ 176','TACUBA','VENTAS','SOLIS']
        def nivel = cta.nivel
        def p1 = cta.padre
        
        if(p1){
            // Nivel 3
             if(nivel == 3){
                 
              	for(int i=0 ; i < sucursales.size(); i++){
                
                     cto = "${cta.padre.descripcion}  ${cta.descripcion}"
                    /*
                    if (cta.descripcion.contains(sucursales[i])) {
                        cto = "${cta.padre.descripcion} "
                        break
                    }
                    */    
             	}
            } 

            //nivel 4
            if(nivel == 4){  
                //for 1
                for(int i=0 ; i< sucursales.size(); i++){
                    // if 1
                    if (cta.descripcion.contains(sucursales[i])) {
                        def ctaN3= cta.padre
                        for(int x=0 ; x< sucursales.size(); x++){
                        	if (cta.descripcion.contains(sucursales[x])) {
                                cto = ctaN3.padre.descripcion
                                break
                            }else{
                                cto = "${ctaN3.padre.descripcion}  ${ctaN3.descripcion}"
                                break
                            }
                        }
                       break 
                    }// termina if 1 
                    def ctaN3= cta.padre
                    //for 2
                    for(int x=0 ; x< sucursales.size(); x++){
                        if (ctaN3.descripcion.contains(sucursales[x])) {
                            cto = "${ctaN3.padre.descripcion} ${cta.descripcion}"
                            break
                        }else{
                            cto = "${ctaN3.padre.descripcion}  ${ctaN3.descripcion} ${cta.descripcion}"             
                        }
                    } // termina for 2
                }// terminia for 1
            }//Termina nivel 4
        }
	    
        /*
        String cto = cta.descripcion
        def p1 = cta.padre
        if(p1) {
            cto = p1.descripcion + " " + cto
            def p2 = p1.padre
            if(p2) {
                cto = p2.descripcion + " " + cto
                def p3 = p2.padre
                if(p3) {
                    cto = p3.descripcion + " " + cto
                }
            }
        }
        */

        return cto
    }

    @NotTransactional
    List<Poliza> refoliar(String subtipo, Integer ejercicio, Integer mes) {

        println "+++++"+ subtipo
        List<Poliza> polizas = Poliza.where{
            subtipo == subtipo && ejercicio == ejercicio && mes == mes
        }.list([sort: 'fecha', order: 'asc'])

        if(subtipo == 'CHEQUES'){
            println 'Ordenando por concepto!'
           // polizas.sort{p -> MovimientoDeCuenta.get(p.egreso) ? MovimientoDeCuenta.get(p.egreso).cheque.folio : 100000000 }
        }

        polizas.each{ p ->
            p.folio = - p.folio
            p.save(flush: true)
        }

        int folio = 0
        polizas.each { p ->
            folio ++
            p.folio = folio
            p.save(flush: true)
        }
        PolizaFolio pfolio = PolizaFolio.where{
            subtipo == subtipo && ejercicio == ejercicio && mes == mes
        }.find()
        pfolio.folio = folio
        pfolio.save flush: true
        return polizas
    }


    def refolizarCheques( List<Poliza> polizas){
        
    }



}
