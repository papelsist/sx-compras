import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

import { NotaDeCredito, Bonificacion, Devolucion } from 'app/cobranza/models';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-aplicar-nota',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-button
      [disabled]="!nota.cfdi"
      (click)="onAplicar()"
      *ngIf="nota.cobro && nota.cobro.saldo > 0.0"
    >
      <mat-icon>library_books</mat-icon> {{ label }}
    </button>
  `
})
export class AplicarNotaComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  @Input() label = 'APLICAR NOTA';
  @Output() aplicar = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onAplicar() {
    this.dialogService
      .openConfirm({
        title: `${this.nota.tipo}: ${this.nota.folio}`,
        message: `APLICAR LA NOTA  A LAS FACTURAS REFERENCIADAS ?`,
        acceptButton: 'APLICAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.aplicar.emit(this.nota);
        }
      });
  }
}
