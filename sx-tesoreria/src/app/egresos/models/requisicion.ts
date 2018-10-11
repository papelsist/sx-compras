import { RequisicionDet } from './requisicionDet';
import { Proveedor } from 'app/models/proveedor';
import { Periodo } from '../../_core/models/periodo';

export interface Requisicion {
  id: string;
  tipo: string;
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
  pagada?: string;
  egreso?: any;
  egresoReferencia?: number;
  reciboDePago?: string;
}

export class RequisicionesFilter {
  fechaInicial?: Date;
  fechaFinal?: Date;
  proveedor?: Partial<Proveedor>;
  registros?: number;
  pendientes?: boolean;
}

export function createRequisicionesFilter() {
  const { fechaInicial, fechaFinal } = Periodo.fromNow(30);
  const registros = 50;
  const pendientes = false;
  return {
    fechaInicial,
    fechaFinal,
    registros,
    pendientes
  };
}
