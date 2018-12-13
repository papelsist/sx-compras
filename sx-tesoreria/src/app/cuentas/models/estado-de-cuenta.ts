import { CuentaDeBanco } from 'app/models';
import { Periodo } from 'app/_core/models/periodo';
import { Movimiento } from './movimiento';

export interface EstadoDeCuenta {
  cuenta: Partial<CuentaDeBanco>;
  saldoInicial: number;
  periodo: Periodo;
  movimientos: Movimiento[];
}
