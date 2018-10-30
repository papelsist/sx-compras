export interface Ficha {
  id?: string;
  folio: number;
  sucursal: { id: string; nombre: string };
  origen: string;
  fecha: string;
  cheque: number;
  efectivo: number;
  total: number;
  cuentaDeBanco: any;
  tipoDeFicha: string;
  fechaCorte: string;
  cancelada: string;
  comentario: string;
  tipo: string;
  creado?: string;
  modificado?: string;
}
