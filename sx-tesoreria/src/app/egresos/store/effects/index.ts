import { GastosEffects } from './gastos.effect';
import { ComprasEffects } from './compras.effects';
import { ChequesEffects } from './cheques.effects';
import { PagoDeRequisicionEffects } from './pagoDeRequisicion.effects';

export const effects: any[] = [
  GastosEffects,
  ComprasEffects,
  ChequesEffects,
  PagoDeRequisicionEffects
];

export * from './gastos.effect';
export * from './compras.effects';
export * from './cheques.effects';
export * from './pagoDeRequisicion.effects';
