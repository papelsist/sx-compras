import { CortesComponent } from './cortes/cortes.component';
import { CortesPendientesComponent } from './cortes-pendientes/cortes-pendientes.component';
import { CortesRegistradosComponent } from './cortes-registrados/cortes-registradoscomponent';
import { CorteComponent } from './corte/corte.component';

export const containers = [
  CortesComponent,
  CortesPendientesComponent,
  CortesRegistradosComponent,
  CorteComponent
];

export * from './cortes/cortes.component';
export * from './cortes-pendientes/cortes-pendientes.component';
export * from './cortes-registrados/cortes-registradoscomponent';
export * from './corte/corte.component';
