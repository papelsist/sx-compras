import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import { Movimiento } from '../../models/movimiento';

import { Observable } from 'rxjs';

@Component({
  selector: 'sx-ingresos-card',
  template: `
  <mat-card>
    <mat-card-title>Ingresos</mat-card-title>
    <mat-divider></mat-divider>
    <ng-template  tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay" >
      <sx-movimientos-table [movimientos]="ingresos$ | async"></sx-movimientos-table>
    </ng-template>
    <mat-divider></mat-divider>
    <mat-card-actions>
      <a mat-button color="accent" class="text-upper" [routerLink]="['egresos']">
        <span>Detalles</span>
      </a>
    </mat-card-actions>
  </mat-card>
  `
})
export class IngresosCardComponent implements OnInit {
  ingresos$: Observable<Movimiento[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getMovimientosLoading));
    this.ingresos$ = this.store.pipe(select(fromStore.getIngresos));
  }
}
