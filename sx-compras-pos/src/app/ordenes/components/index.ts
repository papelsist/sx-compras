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
  CompraPrintComponent
];
export const entryComponents: any[] = [CompraPartidaFormComponent];

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
