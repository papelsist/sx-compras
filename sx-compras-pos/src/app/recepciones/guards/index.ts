import { RecepcionesGuard } from './recepciones.guard';
import { RecepcionExistsGuard } from './recepcion-exists.guard';

export const guards: any[] = [RecepcionesGuard, RecepcionExistsGuard];

export * from './recepciones.guard';
export * from './recepcion-exists.guard';
