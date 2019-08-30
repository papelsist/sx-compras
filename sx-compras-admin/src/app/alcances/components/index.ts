import { AlcancesTableComponent } from './alcances-table/alcances-table.component';
import { AlcanceRunDialogComponent } from './alcance-run-dialog/alcance-run-dialog.component';
import { AlcanceReportDialogComponent } from './alcance-report-dialog/alcance-report-dialog.component';
import { ComprasPendientesComponent } from './compras-pendientes/compras-pendientes.component';

export const components: any[] = [
  AlcancesTableComponent,
  AlcanceRunDialogComponent,
  AlcanceReportDialogComponent,
  ComprasPendientesComponent
];
export const entryComponents: any[] = [
  AlcanceRunDialogComponent,
  AlcanceReportDialogComponent,
  ComprasPendientesComponent
];

export * from './alcances-table/alcances-table.component';
export * from './alcance-run-dialog/alcance-run-dialog.component';
export * from './alcance-report-dialog/alcance-report-dialog.component';
export * from './compras-pendientes/compras-pendientes.component';
