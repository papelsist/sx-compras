import { EnvioComisionEffects } from './envio-comision.effects';
import { FacturistaEffects } from './facturista.effects';
import { PrestamosEffects } from './prestamo.effects';
import { CargosEffects } from './cargo.effects';
import { EstadoDeCuentaEffects } from './estado-de-cuenta.effects';

export const effects: any[] = [
  EnvioComisionEffects,
  FacturistaEffects,
  PrestamosEffects,
  CargosEffects,
  EstadoDeCuentaEffects
];

export * from './envio-comision.effects';
export * from './facturista.effects';
export * from './prestamo.effects';
export * from './cargo.effects';
export * from './estado-de-cuenta.effects';
