import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NotaDeCredito, Bonificacion, Devolucion } from 'app/cobranza/models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-nota-delete',
  template: `
    <button mat-button (click)="onDelete()" color="warn" *ngIf="!nota.cfdi">
      <mat-icon>delete</mat-icon> {{ label }}
    </button>
  `
})
export class NotaDeleteComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  @Input() label = 'ELIMINAR';
  @Output() delete = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onDelete() {
    this.dialogService
      .openConfirm({
        title: 'ELIMINAR NOTA:',
        message: `${this.nota.tipo}: ${this.nota.folio}`,
        acceptButton: 'ELEIMIAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.delete.emit(this.nota);
        }
      });
  }
}
