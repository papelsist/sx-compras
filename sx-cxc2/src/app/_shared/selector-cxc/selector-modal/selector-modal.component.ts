import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CuentaPorCobrar } from 'app/cobranza/models';
import { Cliente } from 'app/models';

@Component({
  selector: 'sx-selector-modal',
  templateUrl: './selector-modal.component.html',
  styleUrls: ['./selector-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorModalComponent implements OnInit {
  cliente: Partial<Cliente>;
  nombre: string;

  selected: CuentaPorCobrar[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<
      SelectorModalComponent,
      Partial<CuentaPorCobrar>[]
    >
  ) {
    this.cliente = data.cliente;
    this.nombre = data.nombre || 'FALTA NOMBRE DEL CLIENTE';
  }

  ngOnInit() {}

  select() {
    this.dialogRef.close(this.selected);
  }
}
