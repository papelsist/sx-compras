import { ComprobanteFiscalService } from './comprobante-fiscal.service';
import { CuentaPorPagarService } from './cuentaPorPagar.service';
import { RequisicionesService } from './requisiciones.service';
import { NotasService } from './notas.service';
import { PagosService } from './pagos.service';
import { AplicacionDePagoService } from './aplicacionDePago.service';
import { ChequesService } from './cheques.service';
import { RembolsoService } from './rembolso.service';

export const services: any[] = [
  ComprobanteFiscalService,
  CuentaPorPagarService,
  RequisicionesService,
  NotasService,
  PagosService,
  AplicacionDePagoService,
  ChequesService,
  RembolsoService
];

export * from './comprobante-fiscal.service';
export * from './cuentaPorPagar.service';
export * from './requisiciones.service';
export * from './notas.service';
export * from './pagos.service';
export * from './aplicacionDePago.service';
export * from './cheques.service';
export * from './rembolso.service';
