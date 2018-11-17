import { CuentaDeBanco } from 'app/models';
import { Movimiento } from 'app/cuentas/models/movimiento';

export interface Comision {
  id: number;
  fecha: string;
  cuenta: Partial<CuentaDeBanco>;
  comision: number;
  impuestoTasa: number;
  impuesto: number;
  comentario: string;
  referencia: string;
  cxp?: Object;
  movimientos: Partial<Movimiento>[];
  dateCreated?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
