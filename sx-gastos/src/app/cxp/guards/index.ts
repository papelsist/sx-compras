import { RequisicionExistsGuard } from './requisicion-exists.guard';
import { NotasGuard } from './notas.guard';
import { NotaExistsGuard } from './nota-exists.guard';
import { FacturasGuard } from './facturas.guard';
import { FacturaExistsGuard } from './factura-exist.guard';
import { PagosGuard } from './pagos.guard';
import { PagoExistsGuard } from './pago-exists.guard';
import { CfdisGuard } from './cfdis.guard';
import { RequisicionesGuard } from './requisiciones.guard';
import { ChequesGuard } from './cheques.guard';

export const guards: any[] = [
  CfdisGuard,
  RequisicionesGuard,
  RequisicionExistsGuard,
  NotasGuard,
  NotaExistsGuard,
  FacturasGuard,
  FacturaExistsGuard,
  PagosGuard,
  PagoExistsGuard,
  ChequesGuard
];

export * from './cfdis.guard';
export * from './requisiciones.guard';
export * from './requisicion-exists.guard';
export * from './notas.guard';
export * from './nota-exists.guard';
export * from './facturas.guard';
export * from './factura-exist.guard';
export * from './pagos.guard';
export * from './pago-exists.guard';
export * from './cheques.guard';
