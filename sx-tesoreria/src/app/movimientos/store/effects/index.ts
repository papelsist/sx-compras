import { TraspasosEffects } from './traspasos.effects';
import { InversionesEffects } from './inversiones.effects';
import { MovimientosDeTesoreriaEffects } from './movimientosDeTesoreria.effects';

export const effects: any[] = [
  TraspasosEffects,
  InversionesEffects,
  MovimientosDeTesoreriaEffects
];

export * from './traspasos.effects';
export * from './inversiones.effects';
export * from './movimientosDeTesoreria.effects';
