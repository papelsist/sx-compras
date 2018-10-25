import { RequisicionesEffects } from './requisiciones.effects';
import { RequisicionFormEffects } from './requisicion-form.effects';
import { NotasEffects } from './notas.effects';
import { FacturasEffects } from './facturas.effects';
import { PagosEffects } from './pagos.effects';
import { AplicacionesEffects } from './aplicaciones.effects';
import { CfdiEffects } from './cfdi.effects';
import { ChequesEffects } from './cheques.effects';
import { RembolsosEffects } from './rembolsos.effects';

export const effects: any[] = [
  CfdiEffects,
  RequisicionesEffects,
  RequisicionFormEffects,
  NotasEffects,
  FacturasEffects,
  PagosEffects,
  AplicacionesEffects,
  ChequesEffects,
  RembolsosEffects
];

export * from './requisiciones.effects';
export * from './requisicion-form.effects';
export * from './notas.effects';
export * from './facturas.effects';
export * from './pagos.effects';
export * from './aplicaciones.effects';
export * from './cheques.effects';
export * from './rembolsos.effects';
