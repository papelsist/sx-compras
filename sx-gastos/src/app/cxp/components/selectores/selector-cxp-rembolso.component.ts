import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';

import { ConfigService } from 'app/utils/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'sx-selector-cxp-rembolso',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>{{title}}</span>
        <span *ngIf="selected">
          Seleccionados: {{selected.length}}
        </span>
      </span>
      <mat-form-field>
        <input matInput placeholder="Folio" autocomplete="off" (keyup.enter)="buscar()" [(ngModel)]="folio">
      </mat-form-field>
      <mat-form-field class="pad-left" flex>
        <input matInput placeholder="Nombre" autocomplete="off" (keyup.enter)="buscar()" [(ngModel)]="nombre">
      </mat-form-field>
    </div>
    <mat-divider></mat-divider>
    <div class="facturas-table-panel">
      <sx-cxp-facturas-table #table [facturas]="facturas" (select)="onSelection($event)"></sx-cxp-facturas-table>
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
export class SelectorCxpRembolsoComponent implements OnInit {
  facturas: any[] = [];
  title: string;
  selected: CuentaPorPagar[];
  folio;
  nombre;
  url;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.url = config.buildApiUrl('rembolsos/pendientes');
  }

  ngOnInit() {}

  onSelection(event: CuentaPorPagar[]) {
    this.selected = event;
  }

  buscar() {
    let params = new HttpParams();
    if (this.nombre) {
      params = params.set('nombre', this.nombre);
    }
    if (this.folio) {
      params = params.set('folio', this.folio);
    }
    this.http
      .get<any[]>(this.url, { params: params })
      .subscribe(res => (this.facturas = res));
  }
}
