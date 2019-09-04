import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Periodo } from 'app/_core/models/periodo';

import { PeriodoDialogComponent } from '../periodo-dialog/periodo-dialog.component';

@Component({
  selector: 'sx-periodo-picker',
  template: `
    <button color="primary" mat-button (click)="seleccionar()">
      <mat-icon>event</mat-icon> {{ periodo.toString() }}
    </button>
  `,
  styles: [``]
})
export class PeriodoPickerComponent implements OnInit {
  @Input()
  toolTip = 'Cambiar el periodo';

  @Input()
  periodo = new Periodo();
  @Output()
  change = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  seleccionar() {
    this.dialog
      .open(PeriodoDialogComponent, {
        data: { periodo: this.periodo }
      })
      .afterClosed()
      .subscribe(res => {
        if (!!res) {
          this.change.emit(res);
        }
      });
  }
}
