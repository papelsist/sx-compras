import { CobroEffects } from '../effects/cobro.effects';
import { SolicitudEffects } from './solicitudes.effects';
import { NotaDeCargoEffects } from './nota-de-cargo.effects';

export const effects: any[] = [
  CobroEffects,
  SolicitudEffects,
  NotaDeCargoEffects
];

export * from '../effects/cobro.effects';
export * from '../effects/solicitudes.effects';
export * from '../effects/nota-de-cargo.effects';
