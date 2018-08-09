import { AnalisisEffects } from './analisis.efects';
import { RequisicionesEffects } from './requisiciones.effects';
import { RequisicionFormEffects } from './requisicion-form.effects';
import { NotasEffects } from './notas.effects';
import { FacturasEffects } from './facturas.effects';
import { ContrarecibosEffects } from './contrarecibos.effects';
import { PagosEffects } from './pagos.effects';

export const effects: any[] = [
  AnalisisEffects,
  RequisicionesEffects,
  RequisicionFormEffects,
  NotasEffects,
  FacturasEffects,
  ContrarecibosEffects,
  PagosEffects
];

export * from './analisis.efects';
export * from './requisiciones.effects';
export * from './requisicion-form.effects';
export * from './notas.effects';
export * from './facturas.effects';
export * from './contrarecibos.effects';
export * from './pagos.effects';
