import { CuentaDeBanco } from 'app/models';
import { Proveedor } from 'app/models/proveedor';
import { Movimiento } from 'app/cuentas/models/movimiento';
import { Morralla } from './morralla';

export interface PagoDeMorralla {
  id: number;
  cuentaEgreso: Partial<CuentaDeBanco>;
  cuentaIngreso: Partial<CuentaDeBanco>;
  fecha: string;
  proveedor?: Partial<Proveedor>;
  formaDePago: string;
  importe: number;
  referencia?: string;
  comentario?: string;
  egreso?: Partial<Movimiento>;
  partidas: Partial<Morralla>[];
  movimientos: Partial<Movimiento[]>;
  lastUpdated?: string;
  updateUser?: string;
}
