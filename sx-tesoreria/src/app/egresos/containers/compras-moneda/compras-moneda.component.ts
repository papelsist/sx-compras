import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra-moneda.actions';
import { CompraMoneda } from '../../models';
import { PeriodoFilter } from 'app/models';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { CompraMonedaFormComponent } from 'app/egresos/components';

@Component({
  selector: 'sx-compras-moneda',
  template: `
    <mat-card flex>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">

      <sx-search-title title="Compras de moneda extranjera" (search)="search = $event">
        <sx-periodo-filter-btn [filter]="filter$ | async" class="options" (change)="onFilterChange($event)"></sx-periodo-filter-btn>

        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo cobro
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>
      <sx-compras-moneda-table [compras]="compras$ | async"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (select)="onSelect($event)"
          (lookupFactura)="onLookupFactura($event)"
          [filter]="search"
          [selected]="selected">
        </sx-compras-moneda-table>
      <!--
      <sx-traspaso-detail [traspaso]="selected" *ngIf="selected"></sx-traspaso-detail>
      -->
      <mat-card-footer>
        <sx-periodo-filter-label [filter]="filter$ | async"></sx-periodo-filter-label>
      </mat-card-footer>
    </ng-template>
    </mat-card>

    <a mat-fab matTooltip="Alta de compra de moneda"
      matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      (click)="onCreate()">
      <mat-icon>add</mat-icon>
    </a>

  `,
  styles: [
    `
      .mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
    `
  ]
})
export class ComprasMonedaComponent implements OnInit {
  compras$: Observable<CompraMoneda[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;
  loading$: Observable<boolean>;
  selected: CompraMoneda;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getCompraMonedasLoading));
    this.compras$ = this.store.pipe(select(fromStore.getAllCompraMonedas));
    this.filter$ = this.store.pipe(select(fromStore.getCompraMonedasFilter));
  }

  onSelect(event: CompraMoneda) {
    this.selected = event;
  }

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromStore.SetCompraMonedasFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadCompraMonedas());
  }

  onCreate() {
    this.selected = null;
    this.dialog
      .open(CompraMonedaFormComponent, {
        data: {},
        width: '650px'
      })
      .afterClosed()
      .subscribe((compra: CompraMoneda) => {
        if (compra) {
          this.store.dispatch(new fromActions.CreateCompraMoneda({ compra }));
        }
      });
  }

  onEdit(event: CompraMoneda) {}

  onDelete(event: CompraMoneda) {
    this.selected = null;
    this.dialogService
      .openConfirm({
        title: `Eliminación de compra de moneda`,
        message: `Folio: ${event.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteCompraMoneda({ compra: event })
          );
        }
      });
  }

  onLookupFactura(event: CompraMoneda) {}
}
