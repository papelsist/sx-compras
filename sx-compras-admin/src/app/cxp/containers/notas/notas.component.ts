import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/notas.actions';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotaDeCreditoCxP } from '../../model';

import * as _ from 'lodash';
import { Periodo } from '../../../_core/models/periodo';
import { ComprobanteFiscalService } from '../../services';

@Component({
  selector: 'sx-notas-cxp',
  template: `
    <mat-card>
      <sx-search-title title="Notas de crédito" (search)="onSearch($event)">
      <div *ngIf="periodo$ | async as periodo" class="info">
        <span class="pad-left">Periodo: </span>
        <span class="pad-left">{{periodo}}</span>
        <sx-periodo-picker [periodo]="periodo" (change)="cambiarPeriodo($event)"></sx-periodo-picker>
      </div>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-notas-table [notas]="notas$ | async" (xml)="onXml($event)" (pdf)="onPdf($event)" [filter]="search$ | async"
      (edit)="onEdit($event)"></sx-notas-table>
    </mat-card>
  `
})
export class NotasComponent implements OnInit {
  notas$: Observable<NotaDeCreditoCxP[]>;
  periodo$: Observable<Periodo>;
  search$ = new Subject<string>();

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: ComprobanteFiscalService
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodoDeNotas));
    this.notas$ = this.store.pipe(select(fromStore.getAllNotas));
  }

  onSelect() {}

  onSearch(event: string) {
    this.search$.next(event);
  }

  getSucursales(object): string[] {
    return _.keys(object);
  }

  onEdit(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromRoot.Go({ path: ['cxp/notas', event.id] }));
  }

  cambiarPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodo(event));
  }

  onPdf(event: NotaDeCreditoCxP) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }

  onXml(event: NotaDeCreditoCxP) {
    this.service.mostrarXml2(event.comprobanteFiscal.id).subscribe(res => {
      const blob = new Blob([res], {
        type: 'text/xml'
      });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }
}
