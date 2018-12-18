import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { PagoDeNomina } from '../../models';
import { GenerarChequeNominaComponent } from './generar-cheque-nomina.component';

@Component({
  selector: 'sx-generar-cheque-nomina-btn',
  template: `
  <ng-container *ngIf="isVisible()">
    <button mat-button mat-button (click)="open()"  [color]="color">
      <mat-icon>account_balance_wallet</mat-icon> Generar cheque
    </button>
  </ng-container>
  `
})
export class GenerarChequeNominaBtnComponent implements OnInit {
  @Input()
  color = 'accent';
  @Input()
  pago: PagoDeNomina;
  @Output()
  generar = new EventEmitter<PagoDeNomina>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog
      .open(GenerarChequeNominaComponent, {
        data: { pago: this.pago },
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.generar.emit({ pago: this.pago, ...command });
        }
      });
  }

  isVisible() {
    return (
      this.pago.formaDePago === 'CHEQUE' &&
      this.pago.egreso &&
      !this.pago.egreso.cheque
    );
  }
}
