import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { CuentaDeBanco } from 'app/models';

import { MatDialog } from '@angular/material';
import { CuentaFormComponent } from 'app/cuentas/components';

@Component({
  selector: 'sx-cuentas-card',
  template: `
    <mat-card>
      <sx-search-title title="Catálogo de cuentas">
        <button (click)="onCreate()" class="actions" mat-menu-item>
          <mat-icon>add</mat-icon> Nueva
        </button>
      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="cuentas-panel">
        <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay" >
          <sx-cuentas-table
            [cuentas]="cuentas$ | async" (edit)="onEdit($event)"
            (select)="onSelect($event)"
            [selectedId]="selectedId$ | async">
          </sx-cuentas-table>
        </ng-template>
      </div>
    </mat-card>
  `,
  styles: [
    `
      .cuentas-panel {
      }
    `
  ]
})
export class CuentasCardComponent implements OnInit {
  cuentas$: Observable<CuentaDeBanco[]>;
  loading$: Observable<boolean>;
  selectedId$: Observable<string>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getCuentasLoading));
    this.cuentas$ = this.store.pipe(select(fromStore.getAllCuentas));
    this.selectedId$ = this.store.pipe(select(fromStore.getSelectedCuentaId));
  }

  onEdit(cuenta: CuentaDeBanco) {
    this.dialog
      .open(CuentaFormComponent, {
        data: { cuenta: cuenta },
        width: '650px'
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.store.dispatch(
            new fromStore.UpdateCuenta({
              cuenta: { id: cuenta.id, changes: data }
            })
          );
        }
      });
  }

  onCreate() {
    this.dialog
      .open(CuentaFormComponent, {
        data: { cuenta: null },
        width: '650px'
      })
      .afterClosed()
      .subscribe(cuenta => {
        if (cuenta) {
          this.store.dispatch(new fromStore.AddCuenta({ cuenta }));
        }
      });
  }

  onSelect(cuenta: CuentaDeBanco) {
    this.store.dispatch(new fromStore.SetSelectedCuenta({ cuenta }));
  }
}
