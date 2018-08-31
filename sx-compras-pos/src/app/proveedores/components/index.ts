import { ProveedoresTableComponent } from './proveedores-table/proveedores-table.component';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
import { ProveedorCreditoComponent } from './proveedor-form/proveedor-credito.component';
import { ProveedorDireccionComponent } from './proveedor-form/proveedor-direccion.component';
import { ProveedorProductosTableComponent } from './proveedor-productos-table/proveedor-productos-table.component';
import { ProductosDisponiblesComponent } from './productos-disponibles/productos-disponibles.component';
import { ProveedorProductoFormComponent } from './proveedor-producto-form/proveedor-producto-form.component';
import { ProveedorListasTableComponent } from './proveedor-listas-table/proveedor-listas-table.component';
import { ProveedorListaFormComponent } from './proveedor-lista-form/proveedor-lista-form.component';
import { ProveedorListaPartidasComponent } from './proveedor-lista-partidas/proveedor-lista-partidas.component';

export const components: any[] = [
  ProveedoresTableComponent,
  ProveedorFormComponent,
  ProveedorCreditoComponent,
  ProveedorDireccionComponent,
  ProveedorProductosTableComponent,
  ProductosDisponiblesComponent,
  ProveedorProductoFormComponent,
  ProveedorListasTableComponent,
  ProveedorListaFormComponent,
  ProveedorListaPartidasComponent
];

export const entryComponents: any[] = [
  ProductosDisponiblesComponent,
  ProveedorProductoFormComponent
];

export * from './proveedores-table/proveedores-table.component';
export * from './proveedor-form/proveedor-form.component';
export * from './proveedor-form/proveedor-credito.component';
export * from './proveedor-form/proveedor-direccion.component';
export * from './proveedor-productos-table/proveedor-productos-table.component';
export * from './productos-disponibles/productos-disponibles.component';
export * from './proveedor-producto-form/proveedor-producto-form.component';
export * from './proveedor-listas-table/proveedor-listas-table.component';
export * from './proveedor-lista-form/proveedor-lista-form.component';
export * from './proveedor-lista-partidas/proveedor-lista-partidas.component';
