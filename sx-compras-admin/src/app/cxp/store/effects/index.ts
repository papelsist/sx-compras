import { AnalisisEffects } from './analisis.efects';
import { RequisicionesEffects } from './requisiciones.effects';
import { RequisicionFormEffects } from './requisicion-form.effects';
import { NotasEffects } from './notas.effects';
import { FacturasEffects } from './facturas.effects';
import { ContrarecibosEffects } from './contrarecibos.effects';
import { PagosEffects } from './pagos.effects';
import { AplicacionesEffects } from './aplicaciones.effects';
import { CfdiEffects } from './cfdi.effects';
import { AnalisisDeNotaEffects } from './analisis-de-nota.effects';
import { AnalisisDeTrsEffects } from './analisis-de-trs.effects';
import { AnalisisTrsDetEffects } from './analisis-trs-det.effects';

export const effects: any[] = [
  CfdiEffects,
  AnalisisEffects,
  RequisicionesEffects,
  RequisicionFormEffects,
  NotasEffects,
  FacturasEffects,
  ContrarecibosEffects,
  PagosEffects,
  AplicacionesEffects,
  AnalisisDeNotaEffects,
  AnalisisDeTrsEffects,
  AnalisisTrsDetEffects
];

export * from './analisis.efects';
export * from './requisiciones.effects';
export * from './requisicion-form.effects';
export * from './notas.effects';
export * from './facturas.effects';
export * from './contrarecibos.effects';
export * from './pagos.effects';
export * from './aplicaciones.effects';
export * from './analisis-de-nota.effects';
export * from './analisis-de-trs.effects';
export * from './analisis-trs-det.effects';
