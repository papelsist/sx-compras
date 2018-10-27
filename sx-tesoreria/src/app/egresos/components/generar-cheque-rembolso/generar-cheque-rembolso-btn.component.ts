import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Rembolso } from '../../models';
import { GenerarChequeRembolsoComponent } from './generar-cheque-rembolso.component';

@Component({
  selector: 'sx-generar-cheque-rembolso-btn',
  template: `
  <ng-container *ngIf="isVisible()">
    <button mat-button mat-button (click)="open()"  [color]="color">
      <mat-icon>account_balance_wallet</mat-icon> Generar cheque
    </button>
  </ng-container>
  `
})
export class GenerarChequeRembolsoBtnComponent implements OnInit {
  @Input()
  color = 'accent';
  @Input()
  rembolso: Rembolso;
  @Output()
  generar = new EventEmitter<Rembolso>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog
      .open(GenerarChequeRembolsoComponent, {
        data: { rembolso: this.rembolso },
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.generar.emit(this.rembolso);
        }
      });
  }

  isVisible() {
    return (
      this.rembolso.formaDePago === 'CHEQUE' &&
      this.rembolso.egreso &&
      !this.rembolso.egreso.cheque
    );
  }
}
