import { ComprasTableComponent } from './compras-table/compras-table.component';
import { CompraFormComponent } from './compra-form/compra-form.component';
import { CompraPartidasTableComponent } from './compra-partidas-table/compra-partidas-table.component';
import { CompraPartidaFormComponent } from './compra-partida-form/compra-partida-form.component';
import { CompraAddPartidaComponent } from './compra-partida-form/compra-add-partoda.component';
import { CerrarCompraComponent } from './compra-form-actions/cerrar-compra.component';
import { EliminarCompraComponent } from './compra-form-actions/eliminar-compra.component';
import { EmailCompraComponent } from './compra-form-actions/email-compra.component';
import { DepurarCompraComponent } from './compra-form-actions/depurar-compra.component';
import { CompraPrintComponent } from './compra-print/compra-print.component';
import { CompradetTableComponent } from './compradet-table/compradet-table.component';
import { ComprasFilterDialogComponent } from './compras-filter/compras-filter-dialog.component';
import { ComprasFilterLabelComponent } from './compras-filter/compras-filter-label.component';
import { ComprasFilterComponent } from './compras-filter/compras-filter.component';
import { ShowCompraDetsComponent } from './show-compradets/show-compradets.component';

export const components: any[] = [
  ComprasTableComponent,
  CompraFormComponent,
  CompraPartidasTableComponent,
  CompraPartidaFormComponent,
  CompraAddPartidaComponent,
  CerrarCompraComponent,
  EliminarCompraComponent,
  EmailCompraComponent,
  DepurarCompraComponent,
  CompraPrintComponent,
  CompradetTableComponent,
  ComprasFilterDialogComponent,
  ComprasFilterLabelComponent,
  ComprasFilterComponent,
  ShowCompraDetsComponent
];
export const entryComponents: any[] = [
  CompraPartidaFormComponent,
  ComprasFilterDialogComponent,
  ShowCompraDetsComponent
];

export * from './compras-table/compras-table.component';
export * from './compra-form/compra-form.component';
export * from './compra-partidas-table/compra-partidas-table.component';
export * from './compra-partida-form/compra-partida-form.component';
export * from './compra-partida-form/compra-add-partoda.component';
export * from './compra-form-actions/cerrar-compra.component';
export * from './compra-form-actions/eliminar-compra.component';
export * from './compra-form-actions/email-compra.component';
export * from './compra-form-actions/depurar-compra.component';
export * from './compra-print/compra-print.component';
export * from './compradet-table/compradet-table.component';

export * from './compras-filter/compras-filter-dialog.component';
export * from './compras-filter/compras-filter-label.component';
export * from './compras-filter/compras-filter.component';

export * from './show-compradets/show-compradets.component';
