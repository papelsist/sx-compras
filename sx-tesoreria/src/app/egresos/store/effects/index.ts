import { GastosEffects } from './gastos.effect';
import { ComprasEffects } from './compras.effects';
import { ChequesEffects } from './cheques.effects';
import { PagoDeRequisicionEffects } from './pagoDeRequisicion.effects';
import { RembolsosEffects } from './rembolsos.effects';
import { CompraMonedaEffects } from './compra-moneda.effects';
import { PagoDeNominaEffects } from './pago-nomina.effects';

export const effects: any[] = [
  GastosEffects,
  ComprasEffects,
  ChequesEffects,
  PagoDeRequisicionEffects,
  RembolsosEffects,
  CompraMonedaEffects,
  PagoDeNominaEffects
];

export * from './gastos.effect';
export * from './compras.effects';
export * from './cheques.effects';
export * from './pagoDeRequisicion.effects';
export * from './rembolsos.effects';
export * from './compra-moneda.effects';
export * from './pago-nomina.effects';
