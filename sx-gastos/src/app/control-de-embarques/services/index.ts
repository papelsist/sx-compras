import { EnvioComisionService } from './envio-comision.service';
import { FacturistaPrestamoService } from './facturista-prestamo.service';
import { TransformacionService } from './transformaciones.service';

export const services: any[] = [
  EnvioComisionService,
  FacturistaPrestamoService,
  TransformacionService
];

export * from './envio-comision.service';
export * from './facturista-prestamo.service';
export * from './transformaciones.service';
