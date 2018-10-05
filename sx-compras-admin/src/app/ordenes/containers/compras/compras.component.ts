import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Compra, ComprasFilter } from '../../models/compra';

import * as _ from 'lodash';
import { CompraDet } from '../../models/compraDet';

@Component({
  selector: 'sx-compras',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit, OnDestroy {
  comprasPorSucursal$: Observable<any>;
  sucursales$: Observable<string[]>;

  filter$: Observable<ComprasFilter>;
  search$: Observable<string>;

  selected$: Observable<String[]>;
  partidas$: Observable<CompraDet[]>;

  tabIndex = 2;
  private _storageKey = 'sx-compras.ordenes';
  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.comprasPorSucursal$ = this.store.pipe(
      select(fromStore.getComprasPorSucursalPendientes)
    );
    this.sucursales$ = this.comprasPorSucursal$.pipe(map(res => _.keys(res)));

    this.filter$ = this.store.pipe(select(fromStore.getComprasFilter));
    this.search$ = this.store.pipe(select(fromStore.getComprasSearchTerm));

    // Tab Idx
    const _tabIdx = localStorage.getItem(this._storageKey + '.tabIndex');
    this.tabIndex = parseFloat(_tabIdx);

    this.partidas$ = of([]); // this.store.pipe(select(fromStore.getSelectedPartidas));
    const lastSearch = localStorage.getItem(this._storageKey + '.filter');

    if (lastSearch) {
      this.onSearch(lastSearch);
    }

    this.selected$ = of([]); // this.store.pipe(select(fromStore.getSelectedComprasIds));
  }

  ngOnDestroy() {
    localStorage.setItem(
      this._storageKey + '.tabIndex',
      this.tabIndex.toString()
    );
  }

  onSelect() {}

  onSearch(term: string) {
    this.store.dispatch(new fromActions.SetComprasSearchTerm({ term }));
  }

  onFilterChange(filter: ComprasFilter) {
    this.store.dispatch(new fromActions.SetComprasFilter({ filter }));
  }

  getSucursales(object): string[] {
    return _.keys(object);
  }

  onEdit(event: Compra) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['ordenes/compras', event.id] })
    );
  }
}
/*
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
  */
