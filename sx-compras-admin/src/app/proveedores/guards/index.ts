import { ProveedoresGuard } from './proveedores.guard';
import { ProveedorExistsGuard } from './proveedor-exists.guard';
import { ProveedorProductosGuard } from './proveedorProductos.guard';
import { ProveedorListasGuard } from './proveedorListas.guard';
import { ProveedorListaExistsGuard } from './proveedorLista-exists.guard';

export const guards: any[] = [
  ProveedoresGuard,
  ProveedorExistsGuard,
  ProveedorProductosGuard,
  ProveedorListasGuard,
  ProveedorListaExistsGuard
];

export * from './proveedores.guard';
export * from './proveedor-exists.guard';
export * from './proveedorProductos.guard';
export * from './proveedorListas.guard';
export * from './proveedorLista-exists.guard';
