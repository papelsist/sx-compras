import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';
import { SaldoPorCuenta } from 'app/cuentas/models/saldoPorCuenta';
import { EjercicioMes } from 'app/models/ejercicioMes';

@Component({
  selector: 'sx-saldo-card',
  template: `
  <mat-card>
    <mat-card-title>
      <span layout>
        <span flex>Resumen</span>
        <span flex></span>
        <sx-ejercicio-mes-btn [periodo]="periodo$ | async" (change)="changePeriodo($event)"></sx-ejercicio-mes-btn>
      </span>
    </mat-card-title>
    <mat-divider></mat-divider>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay" >
      <mat-list *ngIf="saldo$ | async as saldo">

        <mat-list-item>
          <span mat-line layout>
            <h3>Saldo inicial</h3>
          </span>
          <h3 flex>{{saldo.saldoInicial | currency}}</h3>
        </mat-list-item>
        <mat-divider inset></mat-divider>

        <mat-list-item>
          <span mat-line layout>
            <h3>Ingresos</h3>
          </span>
          <h3 flex>{{saldo.ingresos | currency}}</h3>
        </mat-list-item>
        <mat-divider inset></mat-divider>

        <mat-list-item>
          <span mat-line layout>
            <h3>Egresos</h3>
          </span>
          <h3 flex>{{saldo.egresos | currency}}</h3>
        </mat-list-item>
        <mat-divider inset></mat-divider>

        <mat-list-item>
          <span mat-line layout>
            <h3>Saldo </h3>
          </span>
          <h3 flex>{{saldo.saldoFinal | currency}}</h3>
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
  periodo$: Observable<{ ejercicio: number; mes: number }>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getSaldosLoading));
    this.periodo$ = this.store.pipe(select(fromStore.getPeriodo));
    this.saldo$ = this.store.pipe(select(fromStore.getCurrentSaldo2));
  }

  changePeriodo(periodo: EjercicioMes) {
    this.store.dispatch(new fromStore.SetPeriodoDeAnalisis({ periodo }));
  }
}
