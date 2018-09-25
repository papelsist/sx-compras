import { ComprobanteFiscalService } from './comprobante-fiscal.service';
import { CuentaPorPagarService } from './cuentaPorPagar.service';
import { RequisicionDeCompraService } from './requisicionDeCompra.service';
import { NotasService } from './notas.service';
import { PagosService } from './pagos.service';
import { AplicacionDePagoService } from './aplicacionDePago.service';

export const services: any[] = [
  ComprobanteFiscalService,
  CuentaPorPagarService,
  RequisicionDeCompraService,
  NotasService,
  PagosService,
  AplicacionDePagoService
];

export * from './comprobante-fiscal.service';
export * from './cuentaPorPagar.service';
export * from './requisicionDeCompra.service';
export * from './notas.service';
export * from './pagos.service';
export * from './aplicacionDePago.service';
