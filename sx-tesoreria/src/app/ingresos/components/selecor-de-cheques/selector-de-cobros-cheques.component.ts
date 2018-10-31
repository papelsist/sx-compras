import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { CobroCheque } from '../../models';

import { ConfigService } from 'app/utils/config.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'sx-selector-cobros-cheque',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div layout>
      <span>
        <span mat-dialog-title>{{title}}</span>
      </span>
      <mat-form-field flex>
        <input matInput placeholder="Importe" autocomplete="off" (keyup.enter)="buscar()" [(ngModel)]="importe" type="number">
      </mat-form-field>
      <mat-form-field class="pad-left" flex>
        <input matInput placeholder="Número" autocomplete="off" (keyup.enter)="buscar()" [(ngModel)]="folio">
      </mat-form-field>
    </div>
    <mat-divider></mat-divider>
    <div class="cobros-table-panel">
      <sx-cobros-cheque-table [cheques]="cobros" (select)="onSelection($event)"></sx-cobros-cheque-table>
    </div>

    <mat-dialog-actions>
      <button mat-raised-button mat-dialog-close type="button">Cancelar</button>
      <button mat-raised-button [mat-dialog-close]="selected" [disabled]="!selected" type="button" color="primary">Aceptar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .de-cobros-table-panel {
        max-height: 700px;
        overflow: auto;
      }
    `
  ]
})
export class SelectorDeCobrosChequeComponent implements OnInit {
  cobros: any[] = [];
  title: string;
  selected: CobroCheque[];
  folio;
  importe;
  url;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.url = config.buildApiUrl('cxc/chequesDevuetos/cobros');
  }

  ngOnInit() {}

  onSelection(event: CobroCheque[]) {
    this.selected = event;
  }

  buscar() {
    let params = new HttpParams();
    if (this.importe) {
      params = params.set('nombre', this.importe.toString());
    }
    if (this.folio) {
      params = params.set('folio', this.folio);
    }
    this.http
      .get<any[]>(this.url, { params: params })
      .subscribe(res => (this.cobros = res));
  }
}
