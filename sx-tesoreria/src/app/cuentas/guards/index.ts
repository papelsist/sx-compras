import { CuentasGuard } from './cuentas.guard';
import { CuentaExistsGuard } from './cuenta-exits.guard';

export const guards: any[] = [CuentasGuard, CuentaExistsGuard];

export * from './cuentas.guard';
export * from './cuenta-exits.guard';
