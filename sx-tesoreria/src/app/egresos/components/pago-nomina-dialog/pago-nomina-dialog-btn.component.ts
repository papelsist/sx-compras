import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Requisicion, PagoDeNominaCommand } from '../../models';
import { PagoDeNominaDialogComponent } from './pago-nomina-dialog.component';

@Component({
  selector: 'sx-pago-nomina-btn',
  template: `
  <ng-container *ngIf="!requisicion.egreso">
    <button mat-button mat-button (click)="open()" [color]="color">
      <mat-icon >attach_money</mat-icon> Pagar
    </button>
  </ng-container>
  `
})
export class PagoDeNominaBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  requisicion: Requisicion;
  @Output()
  pagar = new EventEmitter<PagoDeNominaCommand>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog
      .open(PagoDeNominaDialogComponent, {
        data: {},
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          const pago: PagoDeNominaCommand = {
            pagoDeNomina: command.id,
            referencia: command.referencia,
            cuenta: command.cuenta.id,
            importe: command.importe ? command.importe : undefined,
            fecha: command.fecha
          };
          this.pagar.emit(pago);
        }
      });
  }
}
