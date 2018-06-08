import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ComprobanteFiscalService } from '../../services';
import { ComprobanteFiscal } from '../../model/comprobanteFiscal';
import { Periodo } from '../../../_core/models/periodo';

@Component({
  selector: 'sx-cxp-cfdis',
  template: `
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm " layout="column">
          <span class="pad-right mat-title">Comprobantes fiscales </span>
          <span class="text-md left-pad">{{periodo.toString()}}</span>
        </span>
        <sx-periodo-picker [periodo]="periodo" (change)="cambiarPeriodo($event)" ></sx-periodo-picker>
        <td-search-input  placeholder="Emisor" showUnderline="true" autocomlete="off"
          (searchDebounce)="searchEmisor($event)" class="pad-left pad-right"></td-search-input>
        <span flex></span>
      </div>
      <mat-divider></mat-divider>
      <div layout="column">
        <div class="cfdis-panel">
          <sx-cfdis-table [comprobantes]="cfdis$ | async" (pdf)="onPdf($event)"
            (xml)="onXml($event)" (select)="onSelect($event)"></sx-cfdis-table>
        </div>
        <ng-container *ngIf="selected$ | async as selected">
          <div class="cfdis-det-panel" *ngIf="selected.length > 0" layout>
            <sx-cfdis-totales-panel [comprobantes]="selected"></sx-cfdis-totales-panel>
          </div>
        </ng-container>
      </div>
    </mat-card>
  `,
  styles: [
    `
    .cfdis-panel {
      min-height: 200px;
      overflow: auto;
    }
    .cfdis-det-panel {
      min-height: 200px;
    }
  `
  ]
})
export class CfdisComponent implements OnInit, OnDestroy {
  cfdis$: Observable<ComprobanteFiscal[]>;
  periodo: Periodo;
  filtro: any;
  selected$ = new Subject<any[]>();
  constructor(private service: ComprobanteFiscalService) {}

  ngOnInit() {
    this.periodo =
      Periodo.fromJson('sx-compras.cfdis.periodo') || Periodo.fromNow(30);
    this.filtro = {
      ...this.periodo.toApiJSON()
    };
    this.load();
  }

  load() {
    this.cfdis$ = this.service.list(this.filtro).pipe(shareReplay());
  }

  searchEmisor(event: string) {
    this.filtro.emisor = event;
    this.load();
  }

  cambiarPeriodo(event: Periodo) {
    this.periodo = event;
    this.filtro = {
      ...this.filtro,
      ...this.periodo.toApiJSON()
    };
    this.load();
  }

  ngOnDestroy() {
    Periodo.saveOnStorage('sx-compras.cfdis.periodo', this.periodo);
  }

  onPdf(event: ComprobanteFiscal) {
    this.service.imprimirCfdi(event).subscribe(
      res => {
        const blob = new Blob([res], {
          type: 'application/pdf'
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error => console.log('Error ', error)
    );
  }

  onXml(event: ComprobanteFiscal) {
    this.service.mostrarXml(event).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }

  onSelect(event: ComprobanteFiscal[]) {
    this.selected$.next(event);
  }
}
