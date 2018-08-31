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
  selector: 'sx-email-compra',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" mat-button
      [disabled]="isDisabled()"
      (click)="doEmail(compra)">
      <mat-icon>email</mat-icon> Enviar
    </button>
  `
})
export class EmailCompraComponent implements OnInit {
  @Input() compra: Compra;
  @Output() email = new EventEmitter<Compra>();
  constructor(private dialogService: TdDialogService) {}

  ngOnInit() {}

  doEmail(compra: Compra) {
    this.dialogService
      .openPrompt({
        title: `Enviar orden de comra: ${this.compra.folio}`,
        message: `Email: `,
        acceptButton: 'Enviar',
        cancelButton: 'Cancelar',
        value: compra.email ? compra.email : 'Digite el correo'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.email.emit(compra);
        }
      });
  }

  isDisabled() {
    return !this.compra.cerrada;
  }
}
