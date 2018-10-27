import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RembolsoPagoDialogComponent } from './rembolos-pago-dialog.component';
import { Rembolso } from '../../models';
import { PagoDeRembolso } from 'app/egresos/models/pagoDeRembolso';

@Component({
  selector: 'sx-rembolso-pago-btn',
  template: `
  <ng-container *ngIf="!rembolso.egreso">
    <button mat-button mat-button (click)="open()" [color]="color">
      <mat-icon >attach_money</mat-icon> Pagar
    </button>
  </ng-container>
  `
})
export class RembolsoPagoDialogBtnComponent implements OnInit {
  @Input()
  color = 'primary';
  @Input()
  rembolso: Rembolso;
  @Output()
  pagar = new EventEmitter<PagoDeRembolso>();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  open() {
    this.dialog
      .open(RembolsoPagoDialogComponent, {
        data: { rembolso: this.rembolso },
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          const pago: PagoDeRembolso = {
            referencia: command.referencia,
            cuenta: command.cuenta.id,
            rembolso: this.rembolso,
            importe: command.importe ? command.importe : undefined
          };
          this.pagar.emit(pago);
        }
      });
  }
}
