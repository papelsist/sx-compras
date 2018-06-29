import { AnalisisEffects } from './analisis.efects';
import { RequisicionesEffects } from './requisiciones.effects';
import { RequisicionFormEffects } from './requisicion-form.effects';

export const effects: any[] = [
  AnalisisEffects,
  RequisicionesEffects,
  RequisicionFormEffects
];

export * from './analisis.efects';
export * from './requisiciones.effects';
export * from './requisicion-form.effects';
