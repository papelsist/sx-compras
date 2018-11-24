import { Cliente, CuentaDeBanco } from 'app/models';
import { Movimiento } from 'app/cuentas/models/movimiento';

export interface DevolucionCliente {
  id: number;
  formaDePago: string;
  fecha: string;
  cliente: Partial<Cliente>;
  afavor: string;
  cuenta: Partial<CuentaDeBanco>;
  cobro: Object;
  importe: number;
  concepto: string;
  egreso: Partial<Movimiento>;
  comentario: string;
  referencia: string;
  dateCreated: string;
  createUser: string;
}
