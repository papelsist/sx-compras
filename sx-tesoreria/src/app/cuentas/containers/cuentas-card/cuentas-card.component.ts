import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromMovimientos from '../../store/actions/movimientos.actions';
import * as fromSaldos from '../../store/actions/saldos.actions';

import { Observable } from 'rxjs';

import { CuentaDeBanco } from 'app/models';

import { MatDialog } from '@angular/material';
import { CuentaFormComponent } from 'app/cuentas/components';

@Component({
  selector: 'sx-cuentas-card',
  template: `
    <mat-card>
      <mat-card-title>
        <div layout>
          <span>Catálogo de cuentas</span>
          <span flex></span>
          <!--
          <ng-container *ngIf="periodo$ | async as periodo">
            <button mat-button>{{periodo.ejercicio}} - {{periodo.mes}}</button>
          </ng-container>
          -->
        </div>
      </mat-card-title>
      <mat-divider></mat-divider>
      <div class="cuentas-panel">
        <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay" >
          <sx-cuentas-table [cuentas]="cuentas$ | async" (edit)="onEdit($event)" (select)="onSelect($event)"></sx-cuentas-table>
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
  periodo$: Observable<{ ejercicio: number; mes: number }>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getCuentasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodo));
    this.cuentas$ = this.store.pipe(select(fromStore.getAllCuentas));
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

  onSelect(cuenta: CuentaDeBanco) {
    this.store.dispatch(new fromMovimientos.LoadMovimientos({ cuenta }));
    this.store.dispatch(new fromSaldos.LoadSaldos({ cuenta }));
  }
}
