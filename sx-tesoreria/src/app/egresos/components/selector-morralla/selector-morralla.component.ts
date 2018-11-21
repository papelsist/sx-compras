import { Component, OnInit } from '@angular/core';

import { Morralla } from 'app/egresos/models/morralla';
import { PagoDeMorrallaService } from 'app/egresos/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'sx-selector-morralla',
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>Morrallas pendiente de pagar</span>
        <span *ngIf="selected">
          Seleccionados: {{selected.length}}
        </span>
      </span>
    </div>
    <mat-divider></mat-divider>
    <div class="facturas-table-panel">
      <sx-morrallas-table [morrallas]="morrallas$ | async" (select)="onSelection($event)" #table></sx-morrallas-table>
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
export class SelectorMorrallaComponent implements OnInit {
  morrallas$: Observable<Morralla[]>;
  selected: Morralla[];
  url;
  constructor(private service: PagoDeMorrallaService) {}

  ngOnInit() {
    this.buscar();
  }

  onSelection(event: Morralla[]) {
    this.selected = event;
  }

  buscar() {
    this.morrallas$ = this.service.pendientes();
  }
}
