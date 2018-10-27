import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Rembolso } from '../../models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-cancelar-pago-rembolso',
  template: `
  <ng-container *ngIf="rembolso.egreso">
    <button mat-button mat-button (click)="open()"  [color]="color">
      <mat-icon>money_off</mat-icon> Cancelar pago
    </button>
  </ng-container>
  `
})
export class CancelarPagoRembolsoComponent implements OnInit {
  @Input()
  color = 'warnd';
  @Input()
  rembolso: Rembolso;

  @Output()
  cancelar = new EventEmitter<Rembolso>();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  open() {
    this.dialogService
      .openConfirm({
        title: 'Cancelar el pago de la rembolso',
        message: `Folio: ${this.rembolso.id}`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.cancelar.emit(this.rembolso);
        }
      });
  }
}
