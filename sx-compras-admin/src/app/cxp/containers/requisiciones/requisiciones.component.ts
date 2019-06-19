import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { RequisicionDeCompraService } from '../../services';

import { Periodo } from 'app/_core/models/periodo';
import { Requisicion } from '../../model';

@Component({
  selector: 'sx-cxp-requisiciones',
  template: `
    <mat-card>
      <div layout="row" layout-align="start center" class="pad-left pad-right">
        <span class="push-left-sm " layout="column">
          <span class="pad-right mat-title">Requisiciones  </span>
          <span class="text-md left-pad">{{periodo.toString()}}</span>
        </span>
        <sx-periodo-picker [periodo]="periodo" (change)="cambiarPeriodo($event)" ></sx-periodo-picker>
        <td-search-input  placeholder="Proveedor" showUnderline="true" autocomlete="off"
          (searchDebounce)="searchEmisor($event)" class="pad-left pad-right"></td-search-input>
        <span flex></span>
      </div>
      <mat-divider></mat-divider>
      <div layout="column">
        <div class="cfdis-panel">
          <sx-requisiciones-table [comprobantes]="cfdis$ | async"
            (print)="onPrint($event)"
            (select)="onSelect($event)"
            (edit)="onEdit($event)">
          </sx-requisiciones-table>
        </div>
        <ng-container *ngIf="selected$ | async as selected">
          <div class="cfdis-det-panel" *ngIf="selected.length > 0" layout>
            <!--
            <sx-cfdis-totales-panel [comprobantes]="selected"></sx-cfdis-totales-panel>
            -->
          </div>
        </ng-container>
      </div>
    </mat-card>
    <a mat-fab matTooltip="Alta de requisición" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
    <mat-icon>add</mat-icon>
    </a>
  `,
  styles: [
    `
    .cfdis-panel {
      min-height: 400px;
    }
    .cfdis-det-panel {
      min-height: 200px;
    }
  `
  ]
})
export class RequisicionesComponent implements OnInit, OnDestroy {
  cfdis$: Observable<Requisicion[]>;
  periodo: Periodo;
  filtro: any;
  selected$ = new Subject<any[]>();
  constructor(
    private service: RequisicionDeCompraService,
    private store: Store<fromStore.CxpState>
  ) {}

  ngOnInit() {
    this.periodo = Periodo.fromStorage('sx-compras.requisiciones.periodo') ||
      Periodo.fromNow(30);
    this.filtro = {
      ...this.periodo.toApiJSON()
    };
    this.load();
  }

  load() {
    this.cfdis$ = this.service.list(this.filtro).pipe(shareReplay());
  }

  searchEmisor(event: string) {
    this.filtro.nombre = event;
    this.load();
  }

  cambiarPeriodo(event: Periodo) {
    if (event) {
      this.periodo = event;
      Periodo.saveOnStorage('sx-compras.requisiciones.periodo', this.periodo);
      this.filtro = {
        ...this.filtro,
        ...this.periodo.toApiJSON()
      };
      this.load();
    }
  }

  ngOnDestroy() {
    Periodo.saveOnStorage('sx-compras.requisiciones.periodo', this.periodo);
  }

  onSelect(event: Requisicion[]) {
    this.selected$.next(event);
  }

  onEdit(event: Requisicion) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['cxp/requisiciones', event.id] })
    );
  }

  onPrint(event: Requisicion) {}
}
