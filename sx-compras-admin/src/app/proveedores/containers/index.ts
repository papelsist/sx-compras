import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedoresPageComponent } from './proveedores-page/proveedores-page.component';
import { ProveedorPageComponent } from './proveedor-page/proveedor-page.component';
import { ProveedorInfoComponent } from './proveedor-info/proveedor-info.component';
import { ProveedoProductosComponent } from './proveedor-productos/proveedor-productos.component';
import { ProveedorListasComponent } from './proveedor-listas/proveedor-listas.component';
import { ProveedorListaCreateComponent } from './proveedor-lista/proveedor-lista-create.component';
import { ProveedorListaEditComponent } from './proveedor-lista/proveedor-lista-edit.component';

export const containers: any[] = [
  ProveedoresPageComponent,
  ProveedoresComponent,
  ProveedorPageComponent,
  ProveedorInfoComponent,
  ProveedoProductosComponent,
  ProveedorListasComponent,
  ProveedorListaCreateComponent,
  ProveedorListaEditComponent
];

export * from './proveedores-page/proveedores-page.component';
export * from './proveedores/proveedores.component';
export * from './proveedor-page/proveedor-page.component';
export * from './proveedor-info/proveedor-info.component';
export * from './proveedor-productos/proveedor-productos.component';
export * from './proveedor-listas/proveedor-listas.component';
export * from './proveedor-lista/proveedor-lista-create.component';
export * from './proveedor-lista/proveedor-lista-edit.component';
