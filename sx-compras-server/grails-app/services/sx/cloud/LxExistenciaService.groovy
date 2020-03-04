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

    def publishAll() {
        Date start = new Date()
        def ejercicio = Periodo.obtenerYear(new Date())
        def mes = Periodo.obtenerMes(new Date()) + 1
        List<Producto> rows = Existencia.findAll("select distinct e.producto from Existencia e where e.anio = ? order by e.clave",
                               [2019],[max: 100])
        rows.each { p ->
            String clave = p.clave
            String descripcion = p.descripcion
            Map exis = [clave: clave, descripcion: descripcion,]
            log.debug('Exis: {} ', exis)
            println 'Exis: ' + exis
            firebaseService.updateCollection('exis', p.id, exis)
        }
    }

    def updateAll() {
        def rows = Existencia.findAll("from Existencia e where e.anio = ? and mes = ? and e.producto.activo = true order by e.clave",
                               [2019, 2],[max: 100])
        rows.groupBy{it.producto}.each{ key, value ->
            value.each{ exis -> 
                Map data = [
                    almacen: exis.sucursalNombre,
                    cantidad: exis.cantidad as Long,
                    recorte: exis.recorte as Long,
                    recorteComentario: exis.recorteComentario
                ]
                String id = exis.sucursalNombre
                def path = "exis/${key.id}/almacenes/${id}" 
                println " Path: ${path}"
                firebaseService.updateDocument(path, data)
            }
            
        }

    }
   

}
