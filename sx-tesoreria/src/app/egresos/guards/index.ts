import { GastosGuard } from './gastos.guard';
import { GastoExistsGuard } from './gasto-exists.guard';
import { ComprasGuard } from './compras.guard';
import { CompraExistsGuard } from './compra-exits.guard';
import { ChequesGuard } from './cheques.guard';
import { RembolsosGuard } from './rembolsos.guard';
import { RembolsoExistsGuard } from './rembolso-exists.guard';
import { CompraMonedasGuard } from './compra-monedas.guard';
import { PagoNominasGuard } from './pago-nominas.guard';
import { PagoNominaExistsGuard } from './pago-nomina-exists.guard';
import { PagoMorrallasGuard } from './pago-morrallas.guard';
import { PagoMorrallaExistsGuard } from './pago-morralla-exists.guard';
import { DevolucionesGuard } from './devoluciones.guard';
import { DevolucionExistsGuard } from './devolucion-exists.guard';

export const guards: any[] = [
  GastosGuard,
  GastoExistsGuard,
  ComprasGuard,
  CompraExistsGuard,
  ChequesGuard,
  RembolsosGuard,
  RembolsoExistsGuard,
  CompraMonedasGuard,
  PagoNominasGuard,
  PagoNominaExistsGuard,
  PagoMorrallasGuard,
  PagoMorrallaExistsGuard,
  DevolucionesGuard,
  DevolucionExistsGuard
];

export * from './gastos.guard';
export * from './gasto-exists.guard';
export * from './compras.guard';
export * from './compra-exits.guard';
export * from './cheques.guard';
export * from './rembolsos.guard';
export * from './rembolso-exists.guard';
export * from './compra-monedas.guard';
export * from './pago-nominas.guard';
export * from './pago-nomina-exists.guard';
export * from './pago-morrallas.guard';
export * from './pago-morralla-exists.guard';
export * from './devoluciones.guard';
export * from './devolucion-exists.guard';
