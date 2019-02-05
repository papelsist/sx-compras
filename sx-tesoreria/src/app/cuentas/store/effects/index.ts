import { CuentasEffects } from './cuentas.effects';
import { MovimientosEffects } from './movimientos.effects';
import { SaldosEffects } from './saldos.effects';
import { EstadoDeCuentaEffects } from './estado-de-cuenta.effects';

export const effects: any[] = [
  CuentasEffects,
  EstadoDeCuentaEffects,
  MovimientosEffects,
  SaldosEffects
];

export * from './cuentas.effects';
export * from './movimientos.effects';
export * from './saldos.effects';
