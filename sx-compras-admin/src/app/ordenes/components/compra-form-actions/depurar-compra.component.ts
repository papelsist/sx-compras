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
  selector: 'sx-depurar-compra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" mat-button color="warn" [disabled]="isDisabled(compra)"
      (click)="doDepurar(compra)">
      <mat-icon>layers_clear</mat-icon> Depurar
    </button>
  `
})
export class DepurarCompraComponent implements OnInit {
  @Input() compra: Compra;
  @Output() deuprar = new EventEmitter<Compra>();
  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  doDepurar(compra: Compra) {
    this.dialogService
      .openConfirm({
        title: `DEPURAR orden de compra: ${this.compra.folio}`,
        message: `${compra.nombre}`,
        acceptButton: 'Depurar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.deuprar.emit(compra);
        }
      });
  }

  isDisabled(compra: Compra) {
    return compra.status !== 'T';
  }
}
