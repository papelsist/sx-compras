import { IngresosPageComponent } from './ingresos-page/ingresos-page.component';
import { CobrosComponent } from './cobros/cobros.component';
import { ChequesDevueltosComponent } from './cheques-devueltos/cheques-devueltos.component';
import { FichasComponent } from './fichas/fichas.component';
import { ChequeDevueltoComponent } from './cheque-devuelto/cheque-devuelto.component';

export const containers: any[] = [
  IngresosPageComponent,
  CobrosComponent,
  ChequesDevueltosComponent,
  ChequeDevueltoComponent,
  FichasComponent
];

export * from './ingresos-page/ingresos-page.component';
export * from './cobros/cobros.component';
export * from './cheques-devueltos/cheques-devueltos.component';
export * from './fichas/fichas.component';
export * from './cheque-devuelto/cheque-devuelto.component';
