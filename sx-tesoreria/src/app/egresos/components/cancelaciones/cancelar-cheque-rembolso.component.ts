import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Rembolso } from '../../models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-cancelar-cheque-rembolso',
  template: `
  <ng-container *ngIf="isVisible()">
    <button mat-button mat-button (click)="open(rembolso)"  [color]="color">
      <mat-icon>account_balance_wallet</mat-icon> Cancelar Cheque
    </button>
  </ng-container>
  `
})
export class CancelarChequeRembolsoComponent implements OnInit {
  @Input()
  color = 'warn';
  @Input()
  rembolso: Rembolso;

  @Output()
  cancelar = new EventEmitter<{ id: number; comentario: string }>();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  open(rembolso: Rembolso) {
    this.dialogService
      .openPrompt({
        title: `Cancelar Cheque ${rembolso.egreso.cheque.folio}`,
        message: `Comentario`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(comentario => {
        if (comentario) {
          this.cancelar.emit({ id: rembolso.id, comentario });
        }
      });
  }

  isVisible() {
    return this.rembolso.egreso && this.rembolso.egreso.cheque;
  }
}
