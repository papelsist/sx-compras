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
import { CompraUiService } from '../../containers/compra/compra-ui.service';

@Component({
  selector: 'sx-cerrar-compra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-button color="primary" type="button"
        (click)="doCerrar(compra)" [disabled]="isDisabled()">
        <mat-icon>grid_off</mat-icon> Cerrar
    </button>
  `
})
export class CerrarCompraComponent implements OnInit {
  @Input() compra: Compra;
  @Output() cerrar = new EventEmitter<Compra>();
  constructor(
    private dialogService: TdDialogService,
    private service: CompraUiService
  ) {}

  ngOnInit() {}

  doCerrar(compra: Compra) {
    this.dialogService
      .openConfirm({
        title: `Cerrar orden de compra: ${this.compra.folio}`,
        message: `Al cerrar la compra esta se envía a las sucursales para iniciar el proceso de recepción `,
        acceptButton: 'Cerrar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.service.cerrar(compra);
        }
      });
  }

  isDisabled() {
    if (this.compra) {
      return this.compra.status === 'A' || this.compra.cerrada;
    } else {
      return true;
    }
  }
}
