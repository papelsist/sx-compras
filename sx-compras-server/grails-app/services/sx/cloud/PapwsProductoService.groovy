package sx.cloud

import com.google.api.core.ApiFuture
import com.google.api.core.ApiFutures
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.WriteResult
import grails.gorm.transactions.Transactional
import grails.util.Environment
import groovy.util.logging.Slf4j
import org.springframework.scheduling.annotation.Scheduled
import sx.audit.Audit
import sx.core.Producto

@Slf4j
@Transactional
class PapwsProductoService {
  final static String COLLECTION = 'productos'

  PapelsaCloudService papelsaCloudService

  def publish(Producto prod) {
    LxProducto xp = new LxProducto(prod)
    ApiFuture<WriteResult> result = getCollection()
      .document(xp.id)
      .set(xp.toMap())
    def updateTime = result.get().getUpdateTime()
    logAudit(xp.id, "UPDATE", "${xp.clave} UPDATED", 1)
    log.debug("PAPWS Producto: {} updated at: {} " , xp.clave, updateTime)
    return updateTime
  }

  /**
   *
   * Sincroniza todo el catalog de productos de Papel en Firebase
   *
   */
  void publishAll() {
    def productos = getCollection()
    List<ApiFuture<WriteResult>> futures = new ArrayList<>();

    findAllProductos().each { xp ->
      futures.add(productos.document(xp.id).set(xp.toMap()))
    }

    ApiFutures.allAsList(futures).get();
    def rows = futures.size()
    log.debug('Productos: {} actualizados', rows)
  }

  def publishDay(Date dia) {
    def productos = getCollection()
    List<ApiFuture<WriteResult>> futures = new ArrayList<>();

    findProductosModificados(dia).each { xp ->
      futures.add(productos.document(xp.id).set(xp.toMap()))
    }

    ApiFutures.allAsList(futures).get();
    def rows = futures.size()
    log.debug('Productos: {} actualizados', rows)


  }

  CollectionReference getCollection() {
    return papelsaCloudService.getFirestore().collection(COLLECTION)
  }


  @Transactional(readOnly = true)
  List<LxProducto> findAllProductos() {
    return  Producto.list(fetch: [linea: 'join', marca: 'join', clase: 'join', productoSat: 'join', unidadSat:'join'],
      sort: 'clave', order: 'asc', max: 5000)
      .collect { Producto prod -> new LxProducto(prod)}
  }

  @Transactional(readOnly = true)
  List<LxProducto> findProductosModificados(Date dia) {
    return  Producto.findAll("from Producto p where date(p.lastUpdated) = ? ",
      sort: 'clave', order: 'asc', max: 5000)
      .collect { Producto prod -> new LxProducto(prod)}
  }

  /**
   * cronExpression: "s m h D M W Y"
   *                  | | | | | | `- Year [optional]
   *                  | | | | | `- Day of Week, 1-7 or SUN-SAT, ?
   *                  | | | | `- Month, 1-12 or JAN-DEC
   *                  | | | `- Day of Month, 1-31, ?
   *                  | | `- Hour, 0-23
   *                  | `- Minute, 0-59
   *                  `- Second, 0-59
   */
  @Scheduled(cron = "0 0 6,19 ? * MON-SAT")
  void syncFromAuditLog() {
    if (Environment.current == Environment.PRODUCTION) {
      Date start = new Date()
      log.debug('Sincronizando productos con FireBase [PROD] Start:{}', start)
      publishDay(start)
    }

  }

  Audit logAudit(String id, String event, String message, int registros, Date updateTime = null) {
    Audit.withNewSession {
      Audit alog = new Audit(
        name: 'LxProducto',
        persistedObjectId: id,
        source: 'OFICINAS',
        target: 'PAPWS FIRESTORE',
        tableName: 'Producto',
        eventName: event,
        message: message,
        dateReplicated: updateTime
      )
      alog.save failOnError: true, flush: true
    }
  }

}
