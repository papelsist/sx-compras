import { OrdenesComponent } from './ordenes/ordenes.component';
import { OrdenDeCompraComponent } from './orden-de-compra/orden-de-compra.component';
import { OrdenesPendientesComponent } from './ordenes-pendientes/ordenes-pendientes.component';

export const containers: any[] = [
  OrdenesComponent,
  OrdenDeCompraComponent,
  OrdenesPendientesComponent
];

export * from './ordenes/ordenes.component';
export * from './orden-de-compra/orden-de-compra.component';
export * from './ordenes-pendientes/ordenes-pendientes.component';
