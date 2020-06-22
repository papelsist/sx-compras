package sx.cloud

import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import java.sql.SQLException

import groovy.transform.ToString
import groovy.util.logging.Slf4j


import grails.util.Environment
import grails.compiler.GrailsCompileStatic

import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.Query
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.WriteBatch
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.CollectionReference
import com.google.api.core.ApiFuture

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.Existencia
import sx.utils.Periodo
import sx.core.Producto


@Slf4j
// @GrailsCompileStatic
class LxExistenciaService {


    FirebaseService firebaseService

    String COLLECTION = 'existencias'


    def updateAll() {

        def sucursales = [
            // 'ANDRADE',
            // 'BOLIVAR',
            'CALLE4',
            // 'CF5FEBRERO',
            //'TACUBA'
            ];
        sucursales.each { suc ->
            updateSucursal(suc)
        }
    }

    /**
    * Suc ex: 'CF5FEBRERO'
    **/
    def updateSucursal(String sucursal) {
        Date start = new Date()
        def ejercicio = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        log.info("Actualizando existencias en Firebase para {} {}/{}", sucursal, ejercicio, mes)
        String sucClave = sucursal == 'CALLE4' ? 'CALLE 4' : sucursal
        def rows = Existencia.executeQuery("""
            from Existencia e 
                where e.anio = ? 
                and e.mes = ? 
                and e.sucursal.nombre = ?
                and e.producto.activo = true
                order by e.clave
            """, [ejercicio, mes, sucClave])
        log.info('Exis to update: {}', rows.size())
        rows.each { exis ->
            // log.info('Updating {} ', data.clave)
            updateFirebase(exis)
        }
    }
    

    void updateFirebase(Existencia exis) {
        String id = exis.producto.id
        String nombre = exis.sucursal.nombre == 'CALLE 4' ? 'CALLE4' : exis.sucursal.nombre
        Map data = [
                clave: exis.clave,
                almacen: nombre,
                cantidad: exis.cantidad as Long,
                recorte: exis.recorte as Long,
                recorteComentario: exis.recorteComentario,
                lastUpdated: exis.lastUpdated,
            ]
        
        DocumentReference exisRef =  firebaseService
                .getFirestore()
                .document("${COLLECTION}/${id}")

        DocumentSnapshot snapShot = exisRef.get().get()

        if (!snapShot.exists()) {
            Map<String,Object> exist = mapExis(exis)
            exisRef.set(exist)
        }

        ApiFuture<WriteResult> result = exisRef
            .collection('almacenes')
            .document(data.almacen)
            .set(data, SetOptions.merge())
        def updateTime = result.get().getUpdateTime()

        log.info("Exis updated time : {} " , updateTime.toDate().format('dd/MM/yyyy'))
    }
   
    Map mapExis(Existencia exis) {
        Map<String,Object> exist = [
            clave: exis.producto.clave, 
            descripcion: exis.producto.descripcion,
            ejercicio: exis.anio as Integer,
            mes: exis.mes as Integer,
            lastUpdated: exis.lastUpdated
        ]
    }

}
