import { CuentaDeBanco } from 'app/models';
import { Movimiento } from 'app/cuentas/models/movimiento';

export interface MovimientoDeTesoreria {
  id?: number;
  fecha: string;
  concepto: string;
  formaDePago: string;
  importe: number;
  cuenta: Partial<CuentaDeBanco>;
  movimiento: Partial<Movimiento>;
  referencia: string;
  comentario: string;
  dateCreated: string;
  lastUpdated: string;
  updateUser: string;
  createUser: string;
}
