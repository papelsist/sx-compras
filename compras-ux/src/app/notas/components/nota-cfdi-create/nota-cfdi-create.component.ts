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
  selector: 'sx-nota-cfdi-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-button
      [disabled]="nota.cfdi || nota.importe <= 0.0"
      (click)="onGenerate()"
      color="accent"
    >
      <mat-icon>settings_input_antenna</mat-icon> GENERAR CFDI
    </button>
  `
})
export class NotaCfdiCreateComponent implements OnInit {
  @Input() nota: NotaDeCredito | Bonificacion | Devolucion;
  @Input() label = 'ELIMINAR';
  @Output() generate = new EventEmitter();

  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  onGenerate() {
    this.dialogService
      .openConfirm({
        title: 'GENERAR CFDI:',
        message: `${this.nota.tipo}: ${this.nota.folio}`,
        acceptButton: 'GENERAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.generate.emit(this.nota);
        }
      });
  }
}
