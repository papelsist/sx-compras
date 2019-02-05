import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CuentaDeBanco } from 'app/models';

@Component({
  selector: 'sx-selector-cuentas',
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>Seleccione una cuenta de banco</span>
      </span>
    </div>
    <mat-divider></mat-divider>
    <div class="facturas-table-panel">
      <sx-cuentas-table
        [cuentas]="cuentas"
        [displayColumns]="columns"
        (select)="onSelect($event)">
      </sx-cuentas-table>
    </div>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="button">Cancelar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .facturas-table-panel {
        max-height: 650px;
        overflow: auto;
      }
    `
  ]
})
export class SelectorDeCuentasComponent implements OnInit {
  cuentas: CuentaDeBanco[];

  columns = ['numero', 'descripcion', 'banco', 'moneda'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectorDeCuentasComponent>
  ) {
    this.cuentas = data.cuentas;
  }

  ngOnInit() {}

  onSelect(event: CuentaDeBanco) {
    this.dialogRef.close(event);
  }
}
