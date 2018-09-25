import { RequisicionDet } from './requisicionDet';

export interface Requisicion {
  id: string;
  folio: number;
  proveedor: { id: string };
  nombre: string;
  moneda: string;
  tipoDeCambio: number;
  fecha: string;
  fechaDePago: string;
  formaDePago: 'CHEQUE' | 'TRANSFERENCIA';
  total: number;
  descuentof: number;
  descuentofImporte: number;
  apagar: number;
  partidas: RequisicionDet[];
  comentario: string;
  selected: boolean;
  cerrada: string;
}
