export interface ReciboDet {
  id: number;
  folio: string;
  serie: string;
  idDocumento: string;
  numParcialidad: number;
  monedaDR: string;
  metodoDePagoDR: string;
  impPagado: number;
  impSaldoInsoluto: number;
  impSaldoAnt: number;
  cxp?: any;
  validacionFactura?: string;
}
