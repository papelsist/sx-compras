import { NotasTableComponent } from './notas-table/notas-table.component';
import { BonificacionesTableComponent } from './bonificaciones-table/bonificaciones-table.component';
import { NotaFormComponent } from './nota-form/nota-form.component';
import { NotaHeaderComponent } from './nota-header/nota-header.component';

export const components: any[] = [
  NotasTableComponent,
  BonificacionesTableComponent,
  NotaFormComponent,
  NotaHeaderComponent
];
export const entryComponents: any[] = [];

export * from './notas-table/notas-table.component';
export * from './bonificaciones-table/bonificaciones-table.component';
export * from './nota-form/nota-form.component';
export * from './nota-header/nota-header.component';
