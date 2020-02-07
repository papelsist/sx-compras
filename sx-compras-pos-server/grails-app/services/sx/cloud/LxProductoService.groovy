package sx.cloud

import javax.annotation.Nullable
import javax.annotation.PostConstruct
import javax.annotation.PreDestroy
import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import javax.annotation.PostConstruct

import com.google.firebase.cloud.*
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.CollectionReference
import com.google.cloud.firestore.Query
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.QuerySnapshot
import com.google.cloud.firestore.DocumentReference
import com.google.cloud.firestore.WriteResult
import com.google.cloud.firestore.SetOptions
import com.google.cloud.firestore.DocumentSnapshot

import com.google.cloud.firestore.ListenerRegistration 
import com.google.cloud.firestore.DocumentSnapshot
import com.google.cloud.firestore.DocumentChange
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.FirestoreException;
import com.google.cloud.firestore.EventListener;
import grails.gorm.transactions.Transactional


@Slf4j
@Transactional
class LxProductoService {

    FirebaseService firebaseService

    def dataSource

    static String TIME_FORMAT = 'dd/MM/yyyy HH:mm'
    


}
