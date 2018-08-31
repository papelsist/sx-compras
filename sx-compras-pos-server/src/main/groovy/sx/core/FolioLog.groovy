package sx.core

trait FolioLog {

    Long nextFolio(String entidad, String serie){
        Folio folio = Folio.findOrCreateWhere(entidad: entidad, serie: serie)
        Long res = folio.folio + 1
        folio.folio = res
        folio.save flush: true
        return res
    }

}