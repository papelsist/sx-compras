import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { TdDialogService } from '@covalent/core';

import { Compra } from '../../models/compra';

@Component({
  selector: 'sx-eliminar-compra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" mat-button color="warn" [disabled]="isDisabled()"
      (click)="doDelete(compra)">
      <mat-icon>delete</mat-icon> Eliminar
    </button>
  `
})
export class EliminarCompraComponent implements OnInit {
  @Input() compra: Compra;
  @Output() delete = new EventEmitter<Compra>();
  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  doDelete(compra: Compra) {
    this.dialogService
      .openConfirm({
        title: `Eliminar orden de compra: ${this.compra.folio}`,
        message: `${compra.nombre}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.delete.emit(compra);
        }
      });
  }

  isDisabled() {
    return this.compra && this.compra.status !== 'P';
  }
}
