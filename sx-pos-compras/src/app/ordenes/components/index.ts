import { OrdenesTableComponent } from './ordenes-table/ordenes-table.component';
import { OrdenFormComponent } from './orden-form/orden-form.component';
import { OrdenFormButtonsComponent } from './orden-form/orden-form-buttons';
import { OrdenDetFormComponent } from './orden-det-form/orden-det-form.component';
import { OrdenFormTableComponent } from './orden-form-table/orden-form-partidas.component';

export const components: any[] = [
  OrdenesTableComponent,
  OrdenFormComponent,
  OrdenFormButtonsComponent,
  OrdenDetFormComponent,
  OrdenFormTableComponent
];
export const entryComponents: any[] = [OrdenDetFormComponent];

export * from './ordenes-table/ordenes-table.component';
export * from './orden-form/orden-form.component';
export * from './orden-form/orden-form-buttons';
export * from './orden-det-form/orden-det-form.component';
export * from './orden-form-table/orden-form-partidas.component';
