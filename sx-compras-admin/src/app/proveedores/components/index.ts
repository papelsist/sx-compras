import { ProveedoresTableComponent } from './proveedores-table/proveedores-table.component';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
import { ProveedorCreditoComponent } from './proveedor-form/proveedor-credito.component';
import { ProveedorDireccionComponent } from './proveedor-form/proveedor-direccion.component';
import { ProveedorProductosTableComponent } from './proveedor-productos-table/proveedor-productos-table.component';
import { ProductosDisponiblesComponent } from './productos-disponibles/productos-disponibles.component';
import { AgregarProvProductoComponent } from './productos-disponibles/agregar-prov-producto.component';

export const components: any[] = [
  ProveedoresTableComponent,
  ProveedorFormComponent,
  ProveedorCreditoComponent,
  ProveedorDireccionComponent,
  ProveedorProductosTableComponent,
  AgregarProvProductoComponent,
  ProductosDisponiblesComponent
];

export const entryComponents: any[] = [ProductosDisponiblesComponent];

export * from './proveedores-table/proveedores-table.component';
export * from './proveedor-form/proveedor-form.component';
export * from './proveedor-form/proveedor-credito.component';
export * from './proveedor-form/proveedor-direccion.component';
export * from './proveedor-productos-table/proveedor-productos-table.component';
export * from './productos-disponibles/agregar-prov-producto.component';
export * from './productos-disponibles/productos-disponibles.component';
