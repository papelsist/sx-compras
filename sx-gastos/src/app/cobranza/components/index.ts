import { CobrosTableComponent } from './cobros-table/cobros-table.component';

import { CarteraFilterBtnComponent } from './cartera-filter/cartera-filter-btn.component';
import { CarteraFilterLabelComponent } from './cartera-filter/cartera-filter-label.component';
import { CarteraFilterComponent } from './cartera-filter/cartera-filter.component';
import { SolicitudesTableComponent } from './solicitudes-table/solicitudes-table.component';
import { SolicitudFormComponent } from './solicitud-form/solicitud-form.component';

export const components: any[] = [
  CobrosTableComponent,
  CarteraFilterBtnComponent,
  CarteraFilterLabelComponent,
  CarteraFilterComponent,
  // Solicitudes
  SolicitudesTableComponent,
  SolicitudFormComponent
];

export const entryComponents: any[] = [
  CarteraFilterComponent,
  SolicitudFormComponent
];

export * from './cartera-filter/cartera-filter-btn.component';
export * from './cartera-filter/cartera-filter-label.component';
export * from './cartera-filter/cartera-filter.component';

export * from './cobros-table/cobros-table.component';

export * from './solicitudes-table/solicitudes-table.component';
export * from './solicitud-form/solicitud-form.component';
