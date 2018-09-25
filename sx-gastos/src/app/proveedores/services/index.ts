import { ProveedoresService } from './proveedores.service';
import { ProveedorProductoService } from './proveedorProducto.service';
import { ListaDePreciosProveedorService } from './listaDePrecioProveedor.service';

export const services: any[] = [
  ProveedoresService,
  ProveedorProductoService,
  ListaDePreciosProveedorService
];

export * from './proveedores.service';
export * from './proveedorProducto.service';
export * from './listaDePrecioProveedor.service';
