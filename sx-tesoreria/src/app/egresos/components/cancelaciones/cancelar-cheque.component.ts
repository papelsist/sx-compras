import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Requisicion, CancelacionDeCheque } from '../../models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-cancelar-cheque',
  template: `
  <ng-container *ngIf="isVisible()">
    <button mat-button mat-button (click)="open(requisicion)"  [color]="color">
      <mat-icon>account_balance_wallet</mat-icon> Cancelar Cheque
    </button>
  </ng-container>
  `
})
export class CancelarChequeComponent implements OnInit {
  @Input()
  color = 'warn';
  @Input()
  requisicion: Requisicion;

  @Output()
  cancelar = new EventEmitter<CancelacionDeCheque>();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  open(requisicion: Requisicion) {
    this.dialogService
      .openPrompt({
        title: `Cancelar Cheque ${requisicion.egreso.cheque.folio}`,
        message: `Comentario`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(comentario => {
        if (comentario) {
          this.cancelar.emit({ requisicion: requisicion.id, comentario });
        }
      });
  }

  isVisible() {
    return this.requisicion.egreso && this.requisicion.egreso.cheque;
  }
}
