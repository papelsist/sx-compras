export interface ComprobanteFiscalConcepto {
  id: string;
  claveProdServ: string;
  claveUnidad: string;
  unidad: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  importe: number;
}
