import { ProveedoresGuard } from './proveedores.guard';
import { ProveedorExistsGuard } from './proveedor-exists.guard';

export const guards: any[] = [ProveedoresGuard, ProveedorExistsGuard];

export * from './proveedores.guard';
export * from './proveedor-exists.guard';
