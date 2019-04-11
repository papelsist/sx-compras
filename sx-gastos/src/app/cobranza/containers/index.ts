import { CobrosComponent } from './cobros/cobros.component';
import { CobranzaPageComponent } from './cobranza-page/cobranza-page.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { CobroComponent } from './cobro/cobro.component';

export const containers: any[] = [
  CobranzaPageComponent,
  CobrosComponent,
  CobroComponent,
  SolicitudesComponent
];

export * from './cobranza-page/cobranza-page.component';
export * from './cobros/cobros.component';
export * from './cobro/cobro.component';

// Solicitudes
export * from './solicitudes/solicitudes.component';
