import { TraspasosGuard } from './traspasos.guard';
import { InversionesGuard } from './inversiones.guard';
import { MovimientosGuard } from './movimientos.guard';
import { ComisionGuard } from './comision.guard';

export const guards: any[] = [
  TraspasosGuard,
  InversionesGuard,
  MovimientosGuard,
  ComisionGuard
];

export * from './traspasos.guard';
export * from './inversiones.guard';
export * from './movimientos.guard';
export * from './comision.guard';
