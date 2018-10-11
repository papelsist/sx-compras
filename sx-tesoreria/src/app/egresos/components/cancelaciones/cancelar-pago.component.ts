import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Requisicion } from '../../models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-cancelar-pago',
  template: `
  <ng-container *ngIf="requisicion.egreso">
    <button mat-button mat-button (click)="open()"  [color]="color">
      <mat-icon>money_off</mat-icon> Cancelar pago
    </button>
  </ng-container>
  `
})
export class CancelarPagoComponent implements OnInit {
  @Input()
  color = 'warnd';
  @Input()
  requisicion: Requisicion;

  @Output()
  cancelar = new EventEmitter<Requisicion>();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  open() {
    this.dialogService
      .openConfirm({
        title: 'Cancelar el pago de la requisición',
        message: `Folio: ${this.requisicion.folio}`,
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.cancelar.emit(this.requisicion);
        }
      });
  }
}
