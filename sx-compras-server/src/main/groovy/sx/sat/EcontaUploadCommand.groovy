package sx.sat

import org.springframework.web.multipart.MultipartFile
import grails.validation.Validateable


class EcontaUploadCommand implements Validateable{
    MultipartFile file
    String documento
    String tipo


    static constraints = {
        documento nullable: false
        tipo nullable: false
        file  validator: { val, obj ->
            if ( val == null ) {
                return false
            }
            if ( val.empty ) {
                return false
            }
            ['xml', 'txt', 'pdf'].any { extension ->
                val.originalFilename?.toLowerCase()?.endsWith(extension)
            }
        }
    }

}
