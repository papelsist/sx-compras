import { GastosEffects } from './gastos.effect';
import { ComprasEffects } from './compras.effects';
import { ChequesEffects } from './cheques.effects';

export const effects: any[] = [GastosEffects, ComprasEffects, ChequesEffects];

export * from './gastos.effect';
export * from './compras.effects';
export * from './cheques.effects';
