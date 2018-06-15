import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Analisis } from '../../model/analisis';
import { CuentaPorPagar } from '../../model/cuentaPorPagar';
import { MatDialog } from '@angular/material';
import { ComsSelectorComponent } from '../../components';
import { Proveedor } from '../../../proveedores/models/proveedor';

@Component({
  selector: 'sx-analisis-edit',
  template: `
  <mat-card>
    <ng-container *ngIf="analisis$ | async as analisis;">
      <mat-card-title>
        <div layout>
          <span class="pad-right">Analisis de factura: </span>
          <sx-factura-header [factura]="factura$ | async"></sx-factura-header>
          <span flex></span>
          <span layout>
            <span>Sub Total:</span>
          </span>
        </div>
      </mat-card-title>
      <mat-card-subtitle>
        <span>{{analisis.proveedor.nombre}}</span>
      </mat-card-subtitle>
      <mat-divider></mat-divider>
      <div class="partidas-panel">
      </div>
      <mat-divider></mat-divider>
      <mat-card-actions>
        <button mat-button (click)="onCancelar($event)"> Cancelar </button>
        <button mat-button (click)="onAgregarCom()" color="primary">
          <mat-icon>assignment_returned</mat-icon> Agregar COM </button>
      </mat-card-actions>
    </ng-container>
  </mat-card>
  `,
  styles: [
    `
  .partidas-panel {
    min-height: 550px;
    max-height: 700px;
    overflow: auto;
  }
  `
  ]
})
export class AnalisisEditComponent implements OnInit, OnDestroy {
  analisis$: Observable<Analisis>;
  factura$: Observable<CuentaPorPagar>;
  subscription: Subscription;
  constructor(
    private store: Store<fromStore.CxpState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.analisis$ = this.store.select(fromStore.getSelectedAnalisis);
    this.factura$ = this.analisis$.pipe(pluck('factura'));
    this.subscription = this.analisis$
      .pipe(pluck('proveedor'))
      .subscribe((proveedor: Proveedor) => {
        this.store.dispatch(new fromStore.LoadComsPendientes(proveedor));
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCancelar() {
    this.store.dispatch(new fromRoot.Back());
  }

  onAgregarCom() {
    const dialogRef = this.dialog.open(ComsSelectorComponent, {
      data: { title: 'Entradas COM pendientes de analizar' },
      width: '750px'
    });
    dialogRef.afterClosed().subscribe(selected => {
      console.log('COMS seleccionados: ', selected);
    });
  }
}
