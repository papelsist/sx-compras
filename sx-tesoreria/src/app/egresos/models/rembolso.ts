import { Periodo } from '../../_core/models/periodo';
import { RembolsoDet } from './rembolsoDet';
import { Sucursal } from 'app/models';

export interface Rembolso {
  id: number;
  sucursal: { id: string };
  nombre: string;
  moneda: string;
  tipoDeCambio: number;
  fecha: string;
  fechaDePago: string;
  formaDePago: 'CHEQUE' | 'TRANSFERENCIA';
  total: number;
  apagar: number;
  partidas: RembolsoDet[];
  comentario: string;
  egreso?: any;
  pago?: any;
}

export class RembolsosFilter {
  sucursal?: Partial<Sucursal>;
  fechaInicial?: Date;
  fechaFinal?: Date;
  registros?: number;
  pendientes?: boolean;
}

export function createRembolsoFilter() {
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
