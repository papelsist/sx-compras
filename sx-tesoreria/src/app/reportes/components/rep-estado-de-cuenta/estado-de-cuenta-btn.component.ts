import { Component, OnInit, Input } from '@angular/core';
import { ReportService } from '../../../reportes/services/report.service';

import { MatDialog } from '@angular/material';
import { RepEstadoDeCuentaComponent } from './rep-estado-de-cuenta.component';
import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-estado-de-cuenta-btn',
  template: `
    <button mat-button  (click)="runReport()" >
      <mat-icon>picture_as_pdf</mat-icon> Estado de cuenta
    </button>
  `
})
export class EstadoDeCuentaBtnComponent implements OnInit {
  @Input()
  color = 'primary';

  @Input()
  smallIcon = false;

  constructor(private service: ReportService, private dialog: MatDialog) {}

  ngOnInit() {}

  runReport() {
    this.dialog
      .open(RepEstadoDeCuentaComponent, {
        data: { periodo: Periodo.monthToDay() },
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.service.runReport('tesoreria/cuentas/estadoDeCuenta', res);
        }
      });
  }
}
