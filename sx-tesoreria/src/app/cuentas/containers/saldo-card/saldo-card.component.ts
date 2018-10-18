import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { Movimiento } from '../../models/movimiento';

import { Observable } from 'rxjs';
import { SaldoPorCuenta } from 'app/cuentas/models/saldoPorCuenta';

@Component({
  selector: 'sx-saldo-card',
  template: `
  <mat-card>
    <mat-card-title>Resumen</mat-card-title>
    <mat-divider></mat-divider>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay" >
      <mat-list *ngIf="saldo$ | async as saldo">

        <mat-list-item>
          <h3 mat-line>Saldo inicial</h3>
          <p mat-line>
            <span>{{saldo.saldoInicial | currency}}</span>
          </p>
        </mat-list-item>
        <mat-divider inset></mat-divider>

        <mat-list-item>
          <h3 mat-line>Ingresos</h3>
          <p mat-line>
            <span>{{saldo.ingresos | currency}}</span>
          </p>
        </mat-list-item>
        <mat-divider inset></mat-divider>

        <mat-list-item>
          <h3 mat-line>Egresos</h3>
          <p mat-line>
            <span>{{saldo.egresos | currency}}</span>
          </p>
        </mat-list-item>
        <mat-divider inset></mat-divider>

        <mat-list-item>
          <h3 mat-line>Saldo final</h3>
          <p mat-line>
            <span>{{saldo.saldoFinal | currency}}</span>
          </p>
        </mat-list-item>
        <mat-divider inset></mat-divider>

      </mat-list>
    </ng-template>
    <mat-divider></mat-divider>
    <mat-card-actions>
      <a mat-button color="accent" class="text-upper" [routerLink]="['estadoDeCuenta']">
        <span>Estado de cuenta</span>
      </a>
    </mat-card-actions>
  </mat-card>
  `
})
export class SaldoCardComponent implements OnInit {
  saldo$: Observable<SaldoPorCuenta>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getSaldosLoading));
    this.saldo$ = this.store.pipe(
      select(fromStore.getCurrentSaldo, { ejercicio: 2018, mes: 10 })
    );
  }
}
