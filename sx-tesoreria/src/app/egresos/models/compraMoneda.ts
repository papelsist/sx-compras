import { CuentaDeBanco } from 'app/models';
import { Proveedor } from 'app/models/proveedor';
import { Movimiento } from 'app/cuentas/models/movimiento';
import { CuentaPorPagar } from './cuentaPorPagar';

export interface CompraMoneda {
  id?: number;
  fecha: string;
  cuentaOrigen: Partial<CuentaDeBanco>;
  cuentaDestino: Partial<CuentaDeBanco>;
  moneda: string;
  importe: number;
  apagar: number;
  formaDePago: string;
  tipoDeCambio: number;
  tipoDeCambioCompra: number;
  diferenciaCambiaria: number;
  proveedor: Partial<Proveedor>;
  afavor?: string;
  movimientos: Partial<Movimiento>[];
  cxp?: Partial<CuentaPorPagar>;
  referencia?: string;
  lastUpdated?: string;
  createUser?: string;
  updateUser?: string;
}
