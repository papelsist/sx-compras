import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Compra } from '../../models/compra';

import * as _ from 'lodash';

@Component({
  selector: 'sx-compras',
  template: `
    <mat-card>
      <sx-search-title title="Compras" (search)="onSearch($event)">
      </sx-search-title>
      <mat-divider></mat-divider>
      <ng-container *ngIf="comprasPorSucursal$ | async as rows">
        <mat-tab-group [(selectedIndex)]="tabIndex">
          <mat-tab label="{{sucursal}}" *ngFor="let sucursal of getSucursales(rows)">
            <sx-compras-table [compras]="rows[sucursal]" [filter]="search$ | async" (edit)="onEdit($event)"></sx-compras-table>
          </mat-tab>
        </mat-tab-group>
      </ng-container>
    </mat-card>
    <a mat-fab matTooltip="Nueva compra" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
	    <mat-icon>add</mat-icon>
    </a>
  `
})
export class ComprasComponent implements OnInit, OnDestroy {
  comprasPorSucursal$: Observable<any>;
  sucursales$: Observable<string[]>;

  search$: Observable<string>;
  tabIndex = 2;
  private _storageKey = 'sx-compras.ordenes';
  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.comprasPorSucursal$ = this.store.pipe(
      select(fromStore.getComprasPorSucursalPendientes)
    );
    this.sucursales$ = this.comprasPorSucursal$.pipe(map(res => _.keys(res)));
    this.search$ = this.store.pipe(select(fromStore.getComprasSearchTerm));

    // Tab Idx
    const _tabIdx = localStorage.getItem(this._storageKey + '.tabIndex');
    this.tabIndex = parseFloat(_tabIdx);
  }
  ngOnDestroy() {
    localStorage.setItem(
      this._storageKey + '.tabIndex',
      this.tabIndex.toString()
    );
  }

  onSelect() {}

  onSearch(event: string) {
    this.store.dispatch(new fromActions.SetSearchTerm(event));
  }

  getSucursales(object): string[] {
    return _.keys(object);
  }

  onEdit(event: Compra) {
    this.store.dispatch(new fromRoot.Go({ path: ['ordenes', event.id] }));
  }
}
