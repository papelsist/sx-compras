import { TraspasosGuard } from './traspasos.guard';
import { InversionesGuard } from './inversiones.guard';
import { MovimientosGuard } from './movimientos.guard';

export const guards: any[] = [
  TraspasosGuard,
  InversionesGuard,
  MovimientosGuard
];

export * from './traspasos.guard';
export * from './inversiones.guard';
export * from './movimientos.guard';
