import { EnvioComisionService } from './envio-comision.service';
import { FacturistaPrestamoService } from './facturista-prestamo.service';

export const services: any[] = [
  EnvioComisionService,
  FacturistaPrestamoService
];

export * from './envio-comision.service';
export * from './facturista-prestamo.service';
