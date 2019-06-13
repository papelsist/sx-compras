import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NotaDeCredito, Bonificacion, Devolucion } from 'app/cobranza/models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-nota-cfdi-cancel',
  template: `
    <button mat-button (click)="onCancel()" color="warn" *ngIf="nota.cfdi">
      <mat-icon>remove_circle_outline</mat-icon> {{ label }}
    </button>
  `
})
export class NotaCfdiCancelComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  @Input() label = 'CANCELAR CFDI';
  @Output() cancel = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onCancel() {
    this.dialogService
      .openConfirm({
        title: `CANCELAR CFDI `,
        message: `NOTA: ${this.nota.tipo}: ${this.nota.folio}`,
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
