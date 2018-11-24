import { ReportButtonComponent } from './report-button/report-button.component';
import { RepPeriodoSucursalComponent } from './rep-periodo-sucursal/rep-periodo-sucursal.component';
import { RelacionPagosComponent } from './relacion-pagos.component';
import { RelacionFichasComponent } from './relacion-fichas.component';
import { RepComisionTarjetasComponent } from './rep-comision-tarjetas/rep-comision-tarjetas.component';
import { RepEstadoDeCuentaComponent } from './rep-estado-de-cuenta/rep-estado-de-cuenta.component';
import { EstadoDeCuentaBtnComponent } from './rep-estado-de-cuenta/estado-de-cuenta-btn.component';

export const components: any[] = [
  ReportButtonComponent,
  RepPeriodoSucursalComponent,
  RelacionPagosComponent,
  RelacionFichasComponent,
  RepComisionTarjetasComponent,
  RepEstadoDeCuentaComponent,
  EstadoDeCuentaBtnComponent
];

export const entryComponents: any[] = [
  RepPeriodoSucursalComponent,
  RelacionPagosComponent,
  RelacionFichasComponent,
  RepComisionTarjetasComponent,
  RepEstadoDeCuentaComponent
];

export * from './report-button/report-button.component';
export * from './rep-periodo-sucursal/rep-periodo-sucursal.component';
export * from './relacion-fichas.component';
export * from './rep-comision-tarjetas/rep-comision-tarjetas.component';
export * from './rep-estado-de-cuenta/rep-estado-de-cuenta.component';
export * from './rep-estado-de-cuenta/estado-de-cuenta-btn.component';
