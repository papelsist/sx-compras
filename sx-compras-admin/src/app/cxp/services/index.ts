import { ComprobanteFiscalService } from './comprobante-fiscal.service';
import { AnalisisService } from './analisis.service';
import { CuentaPorPagarService } from './cuentaPorPagar.service';

export const services: any[] = [
  ComprobanteFiscalService,
  AnalisisService,
  CuentaPorPagarService
];

export * from './comprobante-fiscal.service';
export * from './analisis.service';
export * from './cuentaPorPagar.service';
