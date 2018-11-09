import { TraspasoService } from './traspaso.service';
import { InversionService } from './inversion.service';
import { MovimientoDeTesoreriaService } from './movimientoDeTesoreria.service';
import { ComisionService } from './comision.service';

export const services: any[] = [
  TraspasoService,
  InversionService,
  MovimientoDeTesoreriaService,
  ComisionService
];

export * from './traspaso.service';
export * from './inversion.service';
export * from './movimientoDeTesoreria.service';
export * from './comision.service';
