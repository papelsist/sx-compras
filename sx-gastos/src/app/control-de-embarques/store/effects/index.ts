import { EnvioComisionEffects } from './envio-comision.effects';
import { FacturistaEffects } from './facturista.effects';
import { PrestamosEffects } from './prestamo.effects';
import { CargosEffects } from './cargo.effects';

export const effects: any[] = [
  EnvioComisionEffects,
  FacturistaEffects,
  PrestamosEffects,
  CargosEffects
];

export * from './envio-comision.effects';
export * from './facturista.effects';
export * from './prestamo.effects';
export * from './cargo.effects';
