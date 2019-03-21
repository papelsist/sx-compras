import { EnvioComisionesGuard } from './envio-comisiones.guard';
import { EnvioComisionExistsGuard } from './envio-comision-exists.guard';

export const guards: any[] = [EnvioComisionesGuard, EnvioComisionExistsGuard];

export * from './envio-comisiones.guard';
export * from './envio-comision-exists.guard';
