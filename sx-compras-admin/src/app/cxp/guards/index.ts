import { AnalisisGuard } from './analisis.guard';
import { AnalisisExistsGuard } from './analisis-exists.guard';
import { RequisicionExistsGuard } from './requisicion-exists.guard';
import { NotasGuard } from './notas.guard';
import { NotaExistsGuard } from './nota-exists.guard';
import { FacturasGuard } from './facturas.guard';
import { FacturaExistsGuard } from './factura-exist.guard';
import { ContrarecibosGuard } from './contrarecibos.guard';
import { ContrareciboExistsGuard } from './contrarecibo-exists.guard';
import { PagosGuard } from './pagos.guard';
import { PagoExistsGuard } from './pago-exists.guard';

export const guards: any[] = [
  AnalisisGuard,
  AnalisisExistsGuard,
  RequisicionExistsGuard,
  NotasGuard,
  NotaExistsGuard,
  FacturasGuard,
  FacturaExistsGuard,
  ContrarecibosGuard,
  ContrareciboExistsGuard,
  PagosGuard,
  PagoExistsGuard
];

export * from './analisis.guard';
export * from './analisis-exists.guard';
export * from './requisicion-exists.guard';
export * from './notas.guard';
export * from './nota-exists.guard';
export * from './facturas.guard';
export * from './factura-exist.guard';
export * from './contrarecibos.guard';
export * from './contrarecibo-exists.guard';
export * from './pagos.guard';
export * from './pago-exists.guard';
