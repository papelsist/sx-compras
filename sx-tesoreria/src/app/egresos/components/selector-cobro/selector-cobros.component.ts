import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Cobro } from 'app/ingresos/models';
import { Cliente } from 'app/models';

@Component({
  selector: 'sx-selector-cobros',
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>Cobros registrados ({{cliente.nombre}})</span>
        <span *ngIf="selected">
          Seleccionado: {{ selected.length}}
        </span>
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
  cliente: Cliente;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.cobros = data.cobros;
    this.cliente = data.cliente;
  }

  ngOnInit() {}

  onSelection(event: Cobro[]) {
    this.selected = event;
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }

}
