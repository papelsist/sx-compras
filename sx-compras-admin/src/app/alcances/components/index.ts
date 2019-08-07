import { AlcancesTableComponent } from './alcances-table/alcances-table.component';
import { AlcanceRunDialogComponent } from './alcance-run-dialog/alcance-run-dialog.component';
import { AlcanceReportDialogComponent } from './alcance-report-dialog/alcance-report-dialog.component';

export const components: any[] = [
  AlcancesTableComponent,
  AlcanceRunDialogComponent,
  AlcanceReportDialogComponent
];
export const entryComponents: any[] = [
  AlcanceRunDialogComponent,
  AlcanceReportDialogComponent
];

export * from './alcances-table/alcances-table.component';
export * from './alcance-run-dialog/alcance-run-dialog.component';
export * from './alcance-report-dialog/alcance-report-dialog.component';
