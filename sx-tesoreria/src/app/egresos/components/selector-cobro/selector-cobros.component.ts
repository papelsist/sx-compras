import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Cobro } from 'app/ingresos/models';

@Component({
  selector: 'sx-selector-cobros',
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>Cobros registrados</span>
        <span *ngIf="selected">
          Seleccionado: {{ selected.length}}
        </span>
        <mat-form-field class="pad-left">
          <input matInput placeholder="folio" autocomplete="off">
        </mat-form-field>
      </span>
    </div>
    <mat-divider></mat-divider>
    <div class="facturas-table-panel">
      <sx-cobros-table [cobros]="cobros" (select)="onSelection($event)" #table>
      </sx-cobros-table>
    </div>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="button">Cancelar</button>
      <button mat-button [mat-dialog-close]="selected" [disabled]="!selected" type="button">Seleccionar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .de-facturas-table-panel {
        max-height: 700px;
        overflow: auto;
      }
    `
  ]
})
export class SelectorCobrosComponent implements OnInit {
  cobros: Cobro[];
  selected: Cobro[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.cobros = data.cobros;
  }

  ngOnInit() {}

  onSelection(event: Cobro[]) {
    this.selected = event;
  }
}
