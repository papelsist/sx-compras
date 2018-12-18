package sx.cfdi

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@ToString(includeNames=true,includePackage=false, excludes = ['dateCreated', 'lastUpdated'])
@EqualsAndHashCode(includeFields = true, includes = ['uuid', 'id'])
class CancelacionDeCfdi {

    Cfdi cfdi

    String uuid

    byte[] aka

    String statusCode

    String status

    Boolean isCancelable

    String cancelStatus

    String comentario

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        uuid unique:true
        comentario nullable:true
        aka maxSize:(1024 * 1024)  // 100kb para almacenar el xml
        statusCode maxSize: 200, nullable: true
        isCancelable nullable: true
        cancelStatus nullable: true
        createUser nullable: true
        updateUser nullable: true
    }

}
