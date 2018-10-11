import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PagoDeRequisicionComponent } from './pago-de-requisicion.component';

import { Requisicion } from '../../models';
import { PagoDeRequisicion } from '../../models/pagoDeRequisicion';

@Component({
  selector: 'sx-pago-requisicion-btn',
  template: `
  <button mat-button mat-button (click)="open()" [disabled]="requisicion.egreso" [color]="color">
    <mat-icon >attach_money</mat-icon> Pagar
  </button>
  `
})
export class PagoDeRequisicionBtnComponent implements OnInit {
  @Input()
  color = 'accent';
  @Input()
  requisicion: Requisicion;
  @Output()
  pagar = new EventEmitter<PagoDeRequisicion>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog
      .open(PagoDeRequisicionComponent, {
        data: { requisicion: this.requisicion },
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          const pago: PagoDeRequisicion = {
            referencia: command.referencia,
            cuenta: command.cuenta.id,
            requisicion: this.requisicion
          };
          this.pagar.emit(pago);
        }
      });
  }
}
