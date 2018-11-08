import { TraspasosGuard } from './traspasos.guard';
import { InversionesGuard } from './inversiones.guard';

export const guards: any[] = [TraspasosGuard, InversionesGuard];

export * from './traspasos.guard';
export * from './inversiones.guard';
