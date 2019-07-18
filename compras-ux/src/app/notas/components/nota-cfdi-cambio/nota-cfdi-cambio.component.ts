import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NotaDeCredito, Bonificacion, Devolucion } from 'app/cobranza/models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-nota-cfdi-cambio',
  template: `
    <button mat-button (click)="onCancel()" color="warn" *ngIf="nota.cfdi">
      <mat-icon>swap_horiz</mat-icon> {{ label }}
    </button>
  `
})
export class NotaCfdiCambioComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  @Input() label = 'CAMBIAR CFDI';
  @Output() cancel = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onCancel() {
    this.dialogService
      .openConfirm({
        title: `ATENCION! OPERACION DELICADA CAMBIO DE CFDI`,
        message: `SEGURO QUE DESEA GENERAR UN NUEVO CANCELANDO EL ANTERIOR: ${this.nota.tipo}: ${
          this.nota.folio
        }`,
        acceptButton: 'ACEPTAR',
        cancelButton: 'CANCELAR',
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.cancel.emit(this.nota);
        }
      });
  }
}
