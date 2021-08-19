package sx.integracion

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import org.springframework.stereotype.Component
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.jdbc.core.simple.SimpleJdbcInsert
import org.springframework.jdbc.datasource.DriverManagerDataSource
import sx.ecommerce.DataSourceReplica
import sx.core.Producto

@Slf4j
@Component("productoEcommerceIntegracion")
class ProductoEcommerceIntegracion {
    
    @Autowired
    @Qualifier('dataSource')
    def dataSource

    def transformAndUpdateProductos(){
        def sql = new Sql(dataSource)
        def rows = sql.rows(query)
        rows.each{ prod ->     
            println "Prod: ${prod.id}"
            def producto = Producto.get(prod.id)
            def prodEcom = transformProducto(prod)
            updateProductoEcommerce(prodEcom , producto)
        }
    }

     def transformAndUpdateProducto(Producto producto){
        print "Producto_id : ${producto.id}"
        def newQuery = query + "  where p.id = ?"
        def sql = new Sql(dataSource)
        def prod = sql.firstRow(newQuery,[producto.id]) 
        def prodEcom = transformProducto(prod)

        if(existeProductoEcommerce(producto)){
            println "El producto existe y se tiene que Actualizar"
            updateProductoEcommerce(prodEcom , producto)
        }else{
            if(producto.activoEcommerce){
                println "El producto no existe y se tiene que insertar"
                insertProductoEcommerce(prodEcom , producto)
            }
            
        }

        
    }

    def existeProductoEcommerce(Producto producto){
        def dMDs = getEcommerceDataSource()
        def sqlEcommerce = new Sql(dMDs)
        def queryExiste = """ Select * from producto_ecommerce where producto = ? """
        def row = sqlEcommerce.firstRow(queryExiste,[producto.id])
        def resp = row ? true :  false
        return resp
    }

    def insertProductoEcommerce(prodEcom , producto){
        println "Insertando el producto"
        println prodEcom
        println producto
        def dMDs = getEcommerceDataSource()
        def sqlEcommerce = new Sql(dMDs)
        def insert = new SimpleJdbcInsert(dMDs).withTableName("producto_ecommerce");
        Map<String,Object> parameters = new HashMap<String,Object>()
        //def fields = ["id","clave","descripcion","precio_contado","precio_credito","date_created","last_updated","version","calibre","uso","ancho","gramos","gramos_prod","caras","tags","unidad","acabado","kilos","modo_venta","largo","marca","sku","origen","paquete","clase","puntos","medida","presentacion","tipo","clasificacion","hxp","clasificacion2","color","linea","caras_prod","producto","activo","stock"]
        def fields = ["id","clave","descripcion","precio_contado","precio_credito","date_created","last_updated","version","calibre","uso","ancho","gramos","gramos_prod","caras","tags","unidad","acabado","kilos","modo_venta","largo","marca","sku","origen","paquete","clase","puntos","medida","presentacion","tipo","clasificacion","hxp","clasificacion2","color","linea","caras_prod","producto","activo","stock"]
        def args = [producto.id,producto.clave, producto.descripcion, producto.precioContado, producto.precioCredito,new Date(),new Date(), 0, //producto.version,
                     prodEcom.calibre,prodEcom.uso, prodEcom.ancho, producto.gramos, prodEcom.gramosProd, prodEcom.caras, prodEcom.tags, producto.unidad,
                     prodEcom.acabado,producto.kilos, producto.modoVenta,prodEcom.largo,prodEcom.marca,'SKU',prodEcom.origen,producto.paquete, producto.clase,
                     prodEcom.puntos,prodEcom.medida,prodEcom.presentacion, prodEcom.tipo, prodEcom.clasificacion, producto.hojasPaquete, prodEcom.clasificacion2,
                     prodEcom.color, prodEcom.linea, prodEcom.carasProd, producto.id, producto.activoEcommerce,producto.stock ]
        for (int i = 0; i < fields.size; i++) {
            parameters.put(fields[i],args[i])
        }
        println parameters
        insert.execute(parameters)
    }

     def updateProductoEcommerce(prodEcom, producto){
        
        def dMDs = getEcommerceDataSource()
        def sqlEcommerce = new Sql(dMDs)
        def queryUpdate = """
            update producto_ecommerce set precio_contado= ? , precio_credito = ?, activo  = ?, stock = ?, descripcion = ?,
            paquete = ?, clase = ?, calibre = ?, puntos = ?, ancho = ?, medida = ?, presentacion = ?, tipo = ?, gramos = ?,
            gramos_prod = ?, clasificacion = ?, clave = ?, caras = ?, tags = ?, unidad = ?, hxp = ?  
            where producto = ?  
        """
        def args = [producto.precioContado, producto.precioCredito, producto.activoEcommerce, producto.stock,producto.descripcion,
        producto.paquete, prodEcom.clase,prodEcom.calibre,prodEcom.puntos,prodEcom.ancho,prodEcom.medida, prodEcom.presentacion,
        prodEcom.tipo, prodEcom.gramos,prodEcom.gramosProd, prodEcom.clasificacion,producto.clave,prodEcom.caras,prodEcom.tags,
        prodEcom.unidad, producto.hojasPaquete,
        producto.id]
        sqlEcommerce.execute(queryUpdate,args)
    }

    def transformProducto(def prod){

                List<String> tags = new ArrayList<String>(Arrays.asList(prod.descripcion.split("\\s+")))
                
                def medida=""
                def gramos=""
                def caras=""
                def clasificacion=""
                def puntos = ""
                def origen = ""
                tags.each{tag ->
                    if(tag == '1C' || tag == '2C'){
                        caras = tag.replaceAll("\\s","")
                    }
                    //if(tag.contains('X')){
                    if(tag =~ /^\d+X+\d*$/ ){
                            medida = tag
                    }
                    if(!medida){
                        if(prod.ancho && prod.largo) {
                            medida = "${prod.ancho.stripTrailingZeros().toPlainString()}X${prod.largo.stripTrailingZeros().toPlainString()  }" 
                        }
                    }
                    if(tag ==~ /\d+G/ ){
                        gramos = tag.replaceAll(/G/,"GRS")
                    }
                    if(tag ==~ /\d+GRS/ ){
                        gramos = tag
                    }
                    if(!gramos){
                        if(prod.gramos){
                            gramos = "${prod.gramos.stripTrailingZeros().toPlainString()}GRS" 
                        }
                    }
                    
                    if(tag ==~ /\d+P/ ){
                        puntos = tag.replaceAll(/P/,"PTS")
                    }
                    if(tag ==~ /\d+PTS/ ){
                        puntos = tag
                    }
                    if(!puntos){
                        if(prod.calibre){
                            puntos = "${prod.calibre.stripTrailingZeros().toPlainString()}PTS" 
                        }
                    }
                    if(prod.nacional){
                        origen = 'NACIONAL'  
                    }else{
                        origen = 'IMPORTADO'  
                    }
                    
                }
            
            if(prod.tipo == "ADHESIVO" || prod.marca =='ENGOMADO'){
                clasificacion = "ADHESIVO"
            }
            if(prod.linea == 'BOND' && prod.tipo == "EXTENDIDO"){
                clasificacion = "BOND EXTENDIDO"
            }
            
            if(prod.tipo == "CARTA" || prod.tipo == "OFICIO" || prod.tipo == "CORTADO"){
                clasificacion = "CORTADO"
            }
            
            if(prod.tipo == "EXTENDIDO" && (prod.linea == "OPALINA" || prod.linea == "BRISTOL" || prod.marca == 'CART FLUORESCENTE')){
                clasificacion = "CARTULINAS"
            }
            
            if(prod.tipo =='CAJAS'){
                clasificacion = 'CAJAS'   
            }
            
            if(prod.tipo =='HIGIENICOS'){
                clasificacion = 'HIGIENICOS'   
            }
            
            if(prod.tipo =='PEGAMENTO'){
                clasificacion = 'PEGAMENTO'   
            }

            if(prod.tipo =='EXTENDIDO' && prod.linea == 'CAPLE'){
                clasificacion = 'CAPLE'   
            }
            
            if(prod.tipo =='EXTENDIDO' && prod.marca == 'KRAFT'){
                clasificacion = 'KRAFT'   
            }
            
            if(prod.tipo =='EXTENDIDO' && prod.linea == 'AUTOCOPIANTE'){
                clasificacion = 'AUTOCOPIANTE'   
            }
            
            if(prod.tipo == 'BOBINA'){
                clasificacion ='BOBINA'
            }	
            if(prod.tipo == 'SULFATADA'){
                clasificacion ='SULFATADA'
            }
            if(prod.tipo == 'FOLDER' || prod.tipo == 'SOBRE'){
                clasificacion ='SOBRES Y FOLDERS'
            }
            
            if(prod.clase == 'ALBANENE' || prod.clase == 'MINAGRIS' || prod.clase == 'CARBON' || prod.clase == 'SECANTE' || prod.clase == 'MASCARILLA' || prod.linea == 'PAPELES FINOS' || (prod.clase == 'VARIOS' && clasificacion == "")){
            clasificacion = 'ESPECIALES'   
            }
            
            if(prod.USO == 'EMPAQUE' && clasificacion == ""){
                clasificacion = 'EMPAQUE'
            }
            
            
            if(prod.tipo == 'BOLSA' ){
                clasificacion = 'BOLSA'
            }
            
            if(prod.tipo != 'EXTENDIDO' && clasificacion == ""){
                clasificacion = prod.tipo
            }
            
            // ******************* Paquetes *********************************
            def paquete = false
            def hxp = 0.00
            if (clasificacion == 'CORTADO'){
                paquete = true
                hxp = 500
            }
            
            // ******************* Calsificacion 2 ***************************
            def clasificacion2 = ""
            
            if(prod.linea == 'BOND' ){
                if(clasificacion == 'BOND EXTENDIDO' && prod.uso =='ESCRITURA E IMPRESION'){
                    clasificacion2 = 'PAPEL BOND BLANCO Y COLORES'
                }
                if(clasificacion == 'CORTADO'){
                    clasificacion2 = 'BOND CORTADOS'
                }
                if(prod.marca == 'EUCALIPTO'){
                    clasificacion2 = 'EUCALIPTO ALTA BLANCURA'
                }
                
            }
            
            if(clasificacion == 'CARTULINAS'){
                if(prod.linea == 'BRISTOL'){
                clasificacion2= 'CARTULINA BRISTOL'
                }
                if(prod.linea == 'VARIOS'){
                    clasificacion2= 'VARIOS'
                }
                if(prod.linea == 'OPALINA'){
                    clasificacion2= 'OPALINAS Y ESTUCHES DE PLÁSTICO PARA TARJETAS'
                }   
            }
            
            if(clasificacion == 'TARJETAS Y ESTUCHES'){
                    clasificacion2= 'OPALINAS Y ESTUCHES DE PLÁSTICO PARA TARJETAS'
            }

            
            if(clasificacion == 'SUPERPOLART'){
                clasificacion2= 'PAPEL COUCHE SUPERPOLART'
            }
            
            if(clasificacion == 'SOBRES Y FOLDERS'){
                clasificacion2 = 'SOBRES Y FOLDERS'   
            }
            
            if(clasificacion == 'AUTOCOPIANTE'){
                clasificacion2 = 'PAPEL AUTOCOPIANTE'   
            }
            if(prod.linea== 'POLYPAP' && prod.uso =='ESCRITURA E IMPRESION'){
                clasificacion2 = 'POLYPAP'
            }
        
            if(prod.marca== 'TORTIPAK'){
                clasificacion2 = 'TORTIPAK'
            }
            
            if(clasificacion == 'CAJAS'){
                clasificacion2 = 'CAJAS BOX'   
            }
            
            if(clasificacion == 'CARTON'){
                clasificacion2 = 'CARTÓN DE AGUA GRÁFICO'   
            }
            
            if(clasificacion == 'CAPLE' && prod.marca != 'KRAFT'){
                clasificacion2 = 'CAPLE PONDEROSA'   
            }
            
            if(prod.clase == 'CINTA' || prod.clase == 'PELICULA STRETCH'){
                clasificacion2 = 'PELÍCULA STRETCH Y CINTA ADHESIVA TRANSPARENTE'   
            }
            
            if(clasificacion == 'SULFATADA'){
                clasificacion2 = 'SBS UNA CARA Y DOS CARAS'   
            }
            
            if(prod.clase == 'KRAFT'){
                clasificacion2 = 'SEMIKRAFT, KRAFT, MANILA ENVOLTURA Y POLIBOND'   
            }
            
            if(prod.linea== 'POLYPAP' && prod.uso =='ESCRITURA E IMPRESION'){
                clasificacion2 = 'POLYPAP'
            }
            
            if(clasificacion == 'ADHESIVO' && prod.marca== 'DIMASA'){
                clasificacion2 = 'ADHESIVOS DIMASA'
            }
            
            if(clasificacion == 'ADHESIVO' && prod.marca== 'FASSON'){
                clasificacion2 = 'ADHESIVOS FASSON'
            }
            
            if(clasificacion == 'ADHESIVO' && prod.marca== 'HI-PRINT'){
                clasificacion2 = 'ADHESIVOS HI PRINT'
            }
            
            if(clasificacion == 'ADHESIVO' && prod.marca== 'ADESTOR'){
                clasificacion2 = 'ADHESIVOS ADESTOR'
            }
            
            tags.each{tag ->
                if(tag.contains('CAPPUCHINO')){
                    clasificacion2 = 'PAPEL BOND RECICLADOS'
                }
                if(tag.contains('ALIMPAK')){
                    clasificacion2 = 'ALIMPAK'
                }
            }
           
            tags.add(clasificacion)
            tags.add(prod.tipo)
            tags.add(prod.uso)
            tags.add(prod.linea)
            tags.add(prod.clase)
            tags.add(prod.marca)
            if(medida){
                tags.add(medida)
            }
            
            if(gramos){
                tags.add(gramos)    
            }
            if(puntos){
                tags.add(puntos)    
            }
            if(origen){
                tags.add(origen)    
            }
            if(clasificacion2){
                tags.add(clasificacion2)    
            }


            
        def myProd = new ProductoEcommerce()
            myProd.id = prod.id
            myProd.clave = prod.clave
            myProd.descripcion = prod.descripcion
            myProd.precioContado = prod.precio_contado
            myProd.precioCredito = prod.precio_credito
            myProd.kilos = prod.kilos
            myProd.gramosProd = prod.gramos
            myProd.largo = prod.largo
            myProd.ancho = prod.ancho
            myProd.acabado = prod.acabado
            myProd.calibre = prod.calibre
            myProd.carasProd = prod.caras
            myProd.color = prod.color
            myProd.presentacion = prod.presentacion
            myProd.linea = prod.linea
            myProd.clase = prod.clase
            myProd.marca = prod.marca
            myProd.unidad = prod.unidad
            myProd.tipo = prod.tipo
            myProd.caras = caras
            myProd.gramos = gramos
            myProd.clasificacion = clasificacion
            myProd.clasificacion2 = clasificacion2
            myProd.origen = origen
            myProd.puntos = puntos
            myProd.uso = prod.uso
            myProd.medida = medida
            myProd.modoVenta = prod.modoVenta
            myProd.paquete = paquete
            myProd.hxp = hxp
             myProd.producto = prod.id
            
            Set<String> tags2 = new HashSet<String>(tags)
            
            myProd.tags = tags2
        
        return  myProd
    }

    def getEcommerceDataSource(){
        def dsEcommerce = DataSourceReplica.get(10)
        def driverManagerDs=new DriverManagerDataSource()
        driverManagerDs.driverClassName="com.mysql.jdbc.Driver"
        driverManagerDs.url= dsEcommerce.url
        driverManagerDs.username= dsEcommerce.username
        driverManagerDs.password= dsEcommerce.password
        return driverManagerDs
    }

    String query = """
            SELECT p.id,P.clave,p.descripcion,p.kilos,p.gramos,p.largo,p.ancho,p.acabado,p.calibre,p.caras,p.color,p.presentacion,M.marca ,C.CLASE,L.lINEA,p.unidad,p.precio_contado,p.precio_credito,
            nacional,
            CASE 
                WHEN m.marca= 'TARJETAS' OR c.clase = 'ESTUCHE' THEN 'TARJETAS Y ESTUCHES'
                WHEN p.presentacion = 'BOBINA' OR m.marca ='BOBINAS' THEN 'BOBINA'
                WHEN c.clase = 'STONEPAPER' then 'STONEPAPER'
                WHEN l.linea = 'HIGIENICOS' THEN 'HIGIENICOS'
                WHEN P.descripcion LIKE '%CAJA%' OR P.descripcion LIKE '%CJA%' OR P.descripcion LIKE '% ECT%' OR c.clase = 'CAJAS  BOX PLEGADIZA' THEN 'CAJAS'
                WHEN c.clase = 'PEGAMENTO' THEN 'PEGAMENTO'
                WHEN c.clase = 'CINTA' THEN 'CINTA'
                WHEN p.descripcion like'%CTA%' OR  p.descripcion like '%CARTA%' THEN 'CARTA'
                WHEN p.descripcion like'%OFI%' OR  p.descripcion like '%OFICIO%' THEN 'OFICIO'
                WHEN p.descripcion like'%ADH%' OR  p.descripcion like '%ADHESIVO%' THEN 'ADHESIVO'
                WHEN p.descripcion like'%SBS%' OR  p.descripcion like '%SULF%'  OR m.marca ='NORDIC' THEN 'SULFATADA'
                WHEN p.descripcion like'%FOLDER%' AND p.descripcion like '%%' THEN 'FOLDER'
                WHEN p.descripcion like'%SOB%'   THEN 'SOBRE'
                WHEN p.descripcion like '%EUROCOLORS%' THEN 'CORTADO'
                WHEN p.descripcion like '%TINTA%' THEN 'TINTA'
                WHEN c.clase = 'VIRUTA'   THEN 'VIRUTA'
                when c.clase = 'BOLSA' then 'BOLSA'
                when c.clase = 'ALBANENE' then 'ALBANENE'
                WHEN p.descripcion like'CARTONCILLO%' AND l.linea <> 'CAPLE'    THEN 'CARTONCILLO'
                WHEN p.descripcion like'CARTON %' AND l.linea <> 'CAPLE'    THEN 'CARTON'
                WHEN p.descripcion like'CARTULINA%' or p.descripcion like'%BRISTOL%'  OR C.CLASE ='BRISTOL COLOR'   THEN 'CARTULINAS'
                WHEN p.descripcion like'%DIGI%'   THEN 'DIGITAL'
                WHEN l.linea = 'POLYPAP' THEN 'POLYPAP'
                WHEN l.linea = 'GOFRADO' THEN 'GOFRADO'
                WHEN l.linea = 'MANILA' THEN 'MANILA'
                WHEN l.linea = 'EUROKOTE' THEN 'EUROKOTE'
                WHEN c.clase LIKE 'SUPERPOLART%' OR m.marca like '%SUPERPOLART%' THEN 'SUPERPOLART'
                WHEN c.clase LIKE 'POLART%' THEN 'POLART'
                when m.marca='MAGNECOTE' THEN 'MAGNECOTE'
                WHEN l.linea = 'COUCHE' then 'COUCHE'
            ELSE 'EXTENDIDO' END AS 'TIPO',
            CASE
                WHEN p.descripcion LIKE 'CARTONCILLO %' THEN 'ESCRITURA E IMPRESION'
                WHEN c.clase = 'PEGAMENTO' THEN 'ADHESIVOS'
                WHEN c.clase = 'CINTA' THEN 'EMPAQUE'
                WHEN l.linea = 'CAPLE' THEN 'EMPAQUE'
                WHEN c.clase = 'ENVOLTURA' THEN 'EMPAQUE'
                WHEN l.linea = 'SBS SULFATADA' THEN 'EMPAQUE'
                WHEN l.linea = 'MATERIAL DE EMPAQUE' THEN 'EMPAQUE'
                WHEN p.descripcion LIKE '% CARTON %' THEN 'EMPAQUE'
                WHEN m.marca ='TORTIPAK'  THEN 'EMPAQUE'
                WHEN l.linea = 'HIGIENICOS' THEN 'HIGIENICOS'
                WHEN l.linea = 'ADHESIVOS' THEN 'ADHESIVOS'
            ELSE 'ESCRITURA E IMPRESION' END as 'USO',
            modo_venta as modoVenta
            FROM producto P JOIN marca M ON (M.ID = P.marca_id) JOIN CLASE C ON (C.ID = P.clase_ID) join linea l on (l.id = p.linea_id)
    """

}





