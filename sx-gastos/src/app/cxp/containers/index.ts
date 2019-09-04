import { CxpPageComponent } from './cxp-page/cxp-page.component';
import { CfdisComponent } from './cfdis/cfdis.component';
import { RequisicionesComponent } from './requisiciones/requisiciones.component';
import { RequisicionComponent } from './requisicion/requisicion.component';
import { NotasComponent } from './notas/notas.component';
import { NotaComponent } from './nota/nota.component';
import { FacturasComponent } from './facturas/facturas.component';
import { FacturaComponent } from './factura/factura.component';

import { PagosComponent } from './pagos/pagos.component';
import { PagoComponent } from './pago/pago.component';
import { CfdisConceptosComponent } from './cfdis/cfdis-conceptos.component';
import { ChequesComponent } from './cheques/cheques.component';
import { RembolsosComponent } from './rembolsos/rembolsos.component';
import { RembolsoComponent } from './rembolso/rembolso.component';

export const containers: any[] = [
  CxpPageComponent,
  CfdisComponent,
  CfdisConceptosComponent,
  RequisicionesComponent,
  RequisicionComponent,
  NotasComponent,
  NotaComponent,
  FacturasComponent,
  FacturaComponent,
  PagosComponent,
  PagoComponent,
  ChequesComponent,
  RembolsosComponent,
  RembolsoComponent
];

export * from './cxp-page/cxp-page.component';
export * from './cfdis/cfdis.component';
export * from './cfdis/cfdis-conceptos.component';
export * from './requisiciones/requisiciones.component';
export * from './requisicion/requisicion.component';
export * from './notas/notas.component';
export * from './nota/nota.component';

export * from './facturas/facturas.component';
export * from './factura/factura.component';

export * from './pagos/pagos.component';
export * from './pago/pago.component';
export * from './cheques/cheques.component';
export * from './rembolsos/rembolsos.component';
export * from './rembolso/rembolso.component';
