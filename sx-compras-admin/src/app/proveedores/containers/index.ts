import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedoresPageComponent } from './proveedores-page/proveedores-page.component';
import { ProveedorPageComponent } from './proveedor-page/proveedor-page.component';
import { ProveedorInfoComponent } from './proveedor-info/proveedor-info.component';
import { ProveedoProductosComponent } from './proveedor-productos/proveedor-productos.component';

export const containers: any[] = [
  ProveedoresPageComponent,
  ProveedoresComponent,
  ProveedorPageComponent,
  ProveedorInfoComponent,
  ProveedoProductosComponent
];

export * from './proveedores-page/proveedores-page.component';
export * from './proveedores/proveedores.component';
export * from './proveedor-page/proveedor-page.component';
export * from './proveedor-info/proveedor-info.component';
export * from './proveedor-productos/proveedor-productos.component';
