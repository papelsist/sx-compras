import { ProveedoresGuard } from './proveedores.guard';
import { ProveedorExistsGuard } from './proveedor-exists.guard';
import { ProveedorProductosGuard } from './proveedorProductos.guard';
import { ProveedorListasGuard } from './proveedorListas.guard';

export const guards: any[] = [
  ProveedoresGuard,
  ProveedorExistsGuard,
  ProveedorProductosGuard,
  ProveedorListasGuard
];

export * from './proveedores.guard';
export * from './proveedor-exists.guard';
export * from './proveedorProductos.guard';
export * from './proveedorListas.guard';
