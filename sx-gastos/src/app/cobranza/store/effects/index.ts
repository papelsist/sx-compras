import { CobroEffects } from '../effects/cobro.effects';
import { SolicitudEffects } from './solicitudes.effects';

export const effects: any[] = [CobroEffects, SolicitudEffects];

export * from '../effects/cobro.effects';
export * from '../effects/solicitudes.effects';
