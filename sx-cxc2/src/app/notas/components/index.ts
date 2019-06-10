import { NotasTableComponent } from './notas-table/notas-table.component';
import { NotaFormComponent } from './nota-form/nota-form.component';
import { NotaHeaderComponent } from './nota-header/nota-header.component';
import { NotaCreateModalComponent } from './nota-create-modal/nota-create-modal.component';
import { NotaCreateBtnComponent } from './nota-create-modal/nota-create-btn.component';
import { BonificacionFormComponent } from './bonificacion-form/bonificacion-form.component';
import { BonificacionFormPartidasComponent } from './bonificacion-form-partidas/bonificacion-form-partidas.component';
import { NotaDeleteComponent } from './nota-delete/nota-delete.component';
import { NotaCfdiCreateComponent } from './nota-cfdi-create/nota-cfdi-create.component';

export const components: any[] = [
  NotasTableComponent,
  NotaFormComponent,
  NotaHeaderComponent,
  NotaCreateBtnComponent,
  NotaCfdiCreateComponent,
  NotaDeleteComponent,
  BonificacionFormComponent,
  BonificacionFormPartidasComponent
];
export const entryComponents: any[] = [NotaCreateModalComponent];

export * from './notas-table/notas-table.component';
export * from './nota-form/nota-form.component';
export * from './nota-header/nota-header.component';
export * from './nota-create-modal/nota-create-btn.component';
export * from './nota-create-modal/nota-create-modal.component';
export * from './nota-delete/nota-delete.component';
export * from './nota-cfdi-create/nota-cfdi-create.component';
export * from './bonificacion-form/bonificacion-form.component';
export * from './bonificacion-form-partidas/bonificacion-form-partidas.component';
