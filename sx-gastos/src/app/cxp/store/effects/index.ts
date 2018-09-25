import { RequisicionesEffects } from './requisiciones.effects';
import { RequisicionFormEffects } from './requisicion-form.effects';
import { NotasEffects } from './notas.effects';
import { FacturasEffects } from './facturas.effects';
import { PagosEffects } from './pagos.effects';
import { AplicacionesEffects } from './aplicaciones.effects';
import { CfdiEffects } from './cfdi.effects';

export const effects: any[] = [
  CfdiEffects,
  RequisicionesEffects,
  RequisicionFormEffects,
  NotasEffects,
  FacturasEffects,
  PagosEffects,
  AplicacionesEffects
];

export * from './requisiciones.effects';
export * from './requisicion-form.effects';
export * from './notas.effects';
export * from './facturas.effects';
export * from './pagos.effects';
export * from './aplicaciones.effects';
