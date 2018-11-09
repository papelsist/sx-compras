import { TraspasosEffects } from './traspasos.effects';
import { InversionesEffects } from './inversiones.effects';
import { MovimientosDeTesoreriaEffects } from './movimientosDeTesoreria.effects';
import { ComisionEffects } from './comision.effects';

export const effects: any[] = [
  TraspasosEffects,
  InversionesEffects,
  MovimientosDeTesoreriaEffects,
  ComisionEffects
];

export * from './traspasos.effects';
export * from './inversiones.effects';
export * from './movimientosDeTesoreria.effects';
export * from './comision.effects';
