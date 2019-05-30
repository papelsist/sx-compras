import { CobroEffects } from '../effects/cobro.effects';
import { SolicitudEffects } from './solicitudes.effects';
import { NotaDeCargoEffects } from './nota-de-cargo.effects';

export const effects: any[] = [
  CobroEffects,
  SolicitudEffects,
  NotaDeCargoEffects
];

export * from './cobro.effects';
export * from './solicitudes.effects';
export * from './nota-de-cargo.effects';
