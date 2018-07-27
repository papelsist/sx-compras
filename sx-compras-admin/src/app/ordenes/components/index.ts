import { ComprasTableComponent } from './compras-table/compras-table.component';
import { CompraFormComponent } from './compra-form/compra-form.component';
import { CompraFormButtonsComponent } from './compra-form/compra-form-buttons.component';
import { CompraPartidasTableComponent } from './compra-partidas-table/compra-partidas-table.component';
import { CompraPartidaFormComponent } from './compra-partida-form/compra-partida-form.component';
import { CompraAddPartidaComponent } from './compra-partida-form/compra-add-partoda.component';

export const components: any[] = [
  ComprasTableComponent,
  CompraFormComponent,
  CompraFormButtonsComponent,
  CompraPartidasTableComponent,
  CompraPartidaFormComponent,
  CompraAddPartidaComponent
];
export const entryComponents: any[] = [CompraPartidaFormComponent];

export * from './compras-table/compras-table.component';
export * from './compra-form/compra-form.component';
export * from './compra-form/compra-form-buttons.component';
export * from './compra-partidas-table/compra-partidas-table.component';
export * from './compra-partida-form/compra-partida-form.component';
export * from './compra-partida-form/compra-add-partoda.component';
