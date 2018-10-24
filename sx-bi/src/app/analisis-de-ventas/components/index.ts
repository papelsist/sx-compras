import { VentaFilterFormComponent } from './venta-filter-form/venta-filter-form';
import { VentasAcumuladasTableComponent } from './ventas-acumuladas-table/ventas-acumuladas-table.component';
import { VentasPorProductoTableComponent } from './ventas-por-producto-table/ventas-por-producto-table.component';
import { OperacionesTableComponent } from './operaciones-table/operaciones-table.component';

export const components: any = [
  VentaFilterFormComponent,
  VentasAcumuladasTableComponent,
  VentasPorProductoTableComponent,
  OperacionesTableComponent
];
export const entryComponents: any = [];

export * from './venta-filter-form/venta-filter-form';
export * from './ventas-acumuladas-table/ventas-acumuladas-table.component';
export * from './ventas-por-producto-table/ventas-por-producto-table.component';
export * from './operaciones-table/operaciones-table.component';
