import { CambiosGuard } from './cambios.guard';
import { CambioExistsGuard } from './cambio-exists.guard';

export const guards: any[] = [CambiosGuard, CambioExistsGuard];

export * from './cambios.guard';
export * from './cambio-exists.guard';
