import { CuentasEffects } from './cuentas.effects';
import { MovimientosEffects } from './movimientos.effects';
import { SaldosEffects } from './saldos.effects';

export const effects: any[] = [
  CuentasEffects,
  MovimientosEffects,
  SaldosEffects
];

export * from './cuentas.effects';
export * from './movimientos.effects';
export * from './saldos.effects';
