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

    def publishAll() {
        def ejercicio = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        def rows = Existencia.findAll(""" 
            select distinct e.producto 
            from Existencia e 
            where e.anio = ? 
              and e.mes = ?
              and e.producto.activo = true
            order by e.clave
            """, [ejercicio, mes])
        def updated = 0
        rows.each { p ->
            def map = [
                clave:p.clave, 
                descripcion: p.descripcion, 
                linea: p.linea.linea,
                marca: p.marca.marca,
                clase: p.clase.clase,
                ejercicio: ejercicio, 
                mes: mes]
            log.info('Prod: {}', map)
            publishExis(p.id, map)
            updated++
        }
        log.info('Updated: {}', updated)
    }   

    /**
    * Suc ex: 'CF5FEBRERO'
    **/
    def updateAll(String sucursal) {
        Date start = new Date()
        def ejercicio = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        log.debug("Actualizando existencias en Firebase para {} {}/{}", sucursal, ejercicio, sucursal)
        def rows = Existencia.executeQuery("""
            from Existencia e 
                where e.anio = ? 
                and e.mes = ? 
                and e.sucursal.nombre = ?
                and e.producto.activo = true
                order by e.clave
            """, [ejercicio, mes, sucursal])
        def updated = 0
        rows.each { exis ->
            updateExis(exis)
            log.info('{}', exis.clave)
            updated++
        }
        log.info('Update: {}', updated)
    }

    def updateExis(Existencia exis) {
        Map data = [
            almacen: exis.sucursal.nombre,
            cantidad: exis.cantidad as Long,
            recorte: exis.recorte as Long,
            recorteComentario: exis.recorteComentario,
            lastUpdated: exis.lastUpdated
        ]
        log.info('{} : {}', exis.clave, data)
        updateAlmacen(exis.producto.id, data)
    }

    void publishExis(String id, Map changes) {
        ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection(COLLECTION)
            .document(id)
            .set(changes, SetOptions.merge())
        def updateTime = result.get().getUpdateTime().toDate().format('dd/MM/yyyy')
        log.debug("Exis updated time : {} " , updateTime)
    }

    void updateAlmacen(String id, Map data) {
        ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection(COLLECTION)
            .document(id)
            .collection('almacenes')
            .document(data.almacen)
            .set(data, SetOptions.merge())     
        def updateTime = result.get().getUpdateTime().toDate().format('dd/MM/yyyy')
        log.debug("Exis updated time : {} " , updateTime)
    }
   

}
