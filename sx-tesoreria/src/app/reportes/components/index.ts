import { ReportButtonComponent } from './report-button/report-button.component';
import { RepPeriodoSucursalComponent } from './rep-periodo-sucursal/rep-periodo-sucursal.component';
import { RelacionPagosComponent } from './relacion-pagos.component';

export const components: any[] = [
  ReportButtonComponent,
  RepPeriodoSucursalComponent,
  RelacionPagosComponent
];

export const entryComponents: any[] = [
  RepPeriodoSucursalComponent,
  RelacionPagosComponent
];

export * from './report-button/report-button.component';
export * from './rep-periodo-sucursal/rep-periodo-sucursal.component';
