import { ProveedoresTableComponent } from './proveedores-table/proveedores-table.component';

import { ProveedorProductosTableComponent } from './proveedor-productos-table/proveedor-productos-table.component';
import { ProductosDisponiblesComponent } from './productos-disponibles/productos-disponibles.component';
import { ProveedorProductoFormComponent } from './proveedor-producto-form/proveedor-producto-form.component';
import { ProveedorListasTableComponent } from './proveedor-listas-table/proveedor-listas-table.component';
import { ProveedorListaFormComponent } from './proveedor-lista-form/proveedor-lista-form.component';
import { ProveedorListaPartidasComponent } from './proveedor-lista-partidas/proveedor-lista-partidas.component';
import { AltpModalComponent } from './altp-modal/altp-modal.component';
import { AltpGridComponent } from './altp-modal/altp-grid.component';
import { ProveedorGeneralesFormComponent } from './proveedor-generales-form/proveedor-generales-form.component';
import { ProveedorDireccionFormComponent } from './proveedor-direccion-form/proveedor-direccion-form.component';
import { ProveedorCreditoFormComponent } from './proveedor-credito-form/proveedor-credito-form.component';
import { ProveedorListaPartidas2Component } from './proveedor-lista-partidas2/proveedor-lista-partidas2.component';

export const components: any[] = [
  ProveedoresTableComponent,
  ProveedorProductosTableComponent,
  ProductosDisponiblesComponent,
  ProveedorProductoFormComponent,
  ProveedorListasTableComponent,
  ProveedorListaFormComponent,
  ProveedorListaPartidasComponent,
  AltpModalComponent,
  AltpGridComponent,
  ProveedorGeneralesFormComponent,
  ProveedorDireccionFormComponent,
  ProveedorCreditoFormComponent,
  ProveedorListaPartidas2Component
];

export const entryComponents: any[] = [
  ProductosDisponiblesComponent,
  ProveedorProductoFormComponent,
  AltpModalComponent
];

export * from './proveedores-table/proveedores-table.component';

export * from './proveedor-productos-table/proveedor-productos-table.component';
export * from './productos-disponibles/productos-disponibles.component';
export * from './proveedor-producto-form/proveedor-producto-form.component';
export * from './proveedor-listas-table/proveedor-listas-table.component';
export * from './proveedor-lista-form/proveedor-lista-form.component';
export * from './proveedor-lista-partidas/proveedor-lista-partidas.component';

export * from './altp-modal/altp-modal.component';
export * from './altp-modal/altp-grid.component';

export * from './proveedor-generales-form/proveedor-generales-form.component';
export * from './proveedor-direccion-form/proveedor-direccion-form.component';
export * from './proveedor-credito-form/proveedor-credito-form.component';

export * from './proveedor-lista-partidas2/proveedor-lista-partidas2.component';
