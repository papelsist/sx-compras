import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { GenerarChequeComponent } from './generar-cheque.component';

import { Requisicion } from '../../models';

@Component({
  selector: 'sx-generar-cheque-btn',
  template: `
  <ng-container *ngIf="requisicion.egreso && !requisicion.egreso.cheque">
    <button mat-button mat-button (click)="open()"  [color]="color">
      <mat-icon>account_balance_wallet</mat-icon> Generar cheque
    </button>
  </ng-container>
  `
})
export class GenerarChequeBtnComponent implements OnInit {
  @Input()
  color = 'accent';
  @Input()
  requisicion: Requisicion;
  @Output()
  generar = new EventEmitter<Requisicion>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog
      .open(GenerarChequeComponent, {
        data: { requisicion: this.requisicion },
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          this.generar.emit(this.requisicion);
        }
      });
  }
}
