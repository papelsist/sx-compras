import { TraspasoService } from './traspaso.service';
import { InversionService } from './inversion.service';
import { MovimientoDeTesoreriaService } from './movimientoDeTesoreria.service';

export const services: any[] = [
  TraspasoService,
  InversionService,
  MovimientoDeTesoreriaService
];

export * from './traspaso.service';
export * from './inversion.service';
export * from './movimientoDeTesoreria.service';
