import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NotaDeCredito, Bonificacion, Devolucion } from 'app/cobranza/models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-nota-cancel',
  template: `
    <button mat-button (click)="onCancel()" color="warn" *ngIf="nota.cfdi">
      <mat-icon>cancel</mat-icon> {{ label }}
    </button>
  `
})
export class NotaCancelComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  @Input() label = 'CANCELAR';
  @Output() cancel = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onCancel() {
    this.dialogService
      .openConfirm({
        title: `CANCELAR NOTA ${this.nota.tipo}: ${this.nota.folio}`,
        message: 'SE CANCELA TANTO EL CFDI DE ESTA NOTA COMO SUS APLICACIONES',
        acceptButton: 'ACEPTAR',
        cancelButton: 'CANCELAR',
        width: '600px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.cancel.emit(this.nota);
        }
      });
  }
}
