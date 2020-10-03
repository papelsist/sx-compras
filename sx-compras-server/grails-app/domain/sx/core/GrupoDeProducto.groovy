package sx.core


import groovy.transform.EqualsAndHashCode


@EqualsAndHashCode(includes='nombre')
class GrupoDeProducto {

  String id

  String nombre
  String descripcion
  Boolean activo = true

  Date dateCreated
  Date lastUpdated

  static constraints = {
    nombre minSize:3, maxSize:50, unique:true
  }

  String toString(){
    return nombre
  }

  static mapping={
    id generator:'uuid'
  }

}
