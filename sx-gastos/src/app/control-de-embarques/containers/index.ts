import { EmbarquesPageComponent } from './embarques-page/embarques-page.component';
import { EnvioComisionesComponent } from './envio-comisiones/envio-comisiones.component';
import { EnvioComisionComponent } from './envio-comision/envio-comision.component';
import { PrestamosComponent } from './prestamos/prestamos.component';
import { CargosComponent } from './cargos/cargos.component';
import { EstadoDeCuentaComponent } from './estado-de-cuenta/estado-de-cuenta.component';
import { FacturistasComponent } from './facturistas/facturistas.component';
import { FacturistaComponent } from './facturista/facturista.component';
import { TransformacionesComponent } from './transformaciones/transformaciones.component';

export const containers: any[] = [
  EmbarquesPageComponent,
  EnvioComisionesComponent,
  EnvioComisionComponent,
  PrestamosComponent,
  CargosComponent,
  EstadoDeCuentaComponent,
  FacturistasComponent,
  FacturistaComponent,
  TransformacionesComponent
];

export * from './embarques-page/embarques-page.component';
export * from './envio-comisiones/envio-comisiones.component';
export * from './envio-comision/envio-comision.component';

export * from './prestamos/prestamos.component';

export * from './cargos/cargos.component';

export * from './estado-de-cuenta/estado-de-cuenta.component';

export * from './facturistas/facturistas.component';
export * from './facturista/facturista.component';

export * from './transformaciones/transformaciones.component';
