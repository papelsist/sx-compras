import { CfdisPageComponent } from './cfdis-page/cfdis-page.component';
import { CfdisComponent } from './cfdis/cfdis.component';
import { CancelacionesComponent } from './cancelaciones/cancelaciones.component';
import { CancelacionesPendientesComponent } from './cancelaciones-pendientes/cancelaciones-pendientes.component';

export const containers: any[] = [
  CfdisPageComponent,
  CfdisComponent,
  CancelacionesComponent,
  CancelacionesPendientesComponent
];

export * from './cfdis-page/cfdis-page.component';
export * from './cfdis/cfdis.component';
export * from './cancelaciones/cancelaciones.component';
export * from './cancelaciones-pendientes/cancelaciones-pendientes.component';
