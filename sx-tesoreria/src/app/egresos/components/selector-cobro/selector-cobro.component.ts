import { Component, OnInit } from '@angular/core';

import {
  PagoDeMorrallaService,
  DevolucionClienteService
} from 'app/egresos/services';
import { Observable } from 'rxjs';
import { Cobro } from 'app/ingresos/models';

@Component({
  selector: 'sx-selector-cobro',
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>Cobros registrados</span>
        <span *ngIf="selected">
          Seleccionado: {{selected.importe | currency}}
        </span>
        <mat-form-field class="pad-left">
          <input matInput placeholder="folio" autocomplete="off">
        </mat-form-field>
      </span>
    </div>
    <mat-divider></mat-divider>
    <div class="facturas-table-panel">
      <sx-morrallas-table [morrallas]="cobros$ | async" (select)="onSelection($event)" #table></sx-morrallas-table>
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
export class SelectorCobroComponent implements OnInit {
  cobros$: Observable<Cobro[]>;
  selected: Cobro;
  url;
  constructor(private service: DevolucionClienteService) {}

  ngOnInit() {
    this.buscar();
  }

  onSelection(event: Cobro) {
    this.selected = event;
  }

  buscar() {
    this.cobros$ = this.service.cobros();
  }
}
