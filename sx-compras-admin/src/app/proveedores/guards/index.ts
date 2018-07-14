import { ProveedoresGuard } from './proveedores.guard';
import { ProveedorExistsGuard } from './proveedor-exists.guard';
import { ProveedorProductosGuard } from './proveedorProductos.guard';

export const guards: any[] = [
  ProveedoresGuard,
  ProveedorExistsGuard,
  ProveedorProductosGuard
];

export * from './proveedores.guard';
export * from './proveedor-exists.guard';
export * from './proveedorProductos.guard';
