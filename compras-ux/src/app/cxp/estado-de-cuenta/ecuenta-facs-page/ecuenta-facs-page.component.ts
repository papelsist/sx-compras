import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../store/estado-de-cuenta.reducer';
import * as fromActions from '../store/ecuenta.actions';

import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, filter, tap, distinctUntilChanged } from 'rxjs/operators';

import { Periodo } from 'app/_core/models/periodo';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { ProveedorUtilsService } from 'app/proveedores/services/proveedor-utils.service';

@Component({
  selector: 'sx-ecuenta-facs-page',
  templateUrl: './ecuenta-facs-page.component.html',
  styleUrls: ['./ecuenta-facs-page.component.scss']
})
export class EcuentaFacsPageComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  facturas$: Observable<any[]>;
  periodo$: Observable<Periodo>;
  destroy$ = new Subject<boolean>();

  proveedor: Proveedor;
  proveedor$: Observable<Proveedor>;

  selected: any[] = [];

  constructor(
    private store: Store<fromStore.State>,
    private provedorUi: ProveedorUtilsService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.selectLoading));
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.proveedor$ = this.store.pipe(select(fromStore.selectProveedor));
    this.facturas$ = this.store.pipe(select(fromStore.selectFacturas));

    const p$ = this.proveedor$.pipe(
      distinctUntilChanged(),
      filter(p => !!p),
      tap(p => (this.proveedor = p)),
      takeUntil(this.destroy$)
    );

    combineLatest(this.periodo$, p$)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(([periodo, proveedor]) =>
        this.store.dispatch(
          new fromActions.LoadFacturas({
            periodo,
            proveedorId: proveedor.id
          })
        )
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  seleccionar() {
    this.provedorUi.seleccionar().subscribe(res => {
      if (res) {
        this.store.dispatch(new fromActions.SetProveedor({ proveedor: res }));
      }
    });
  }

  reload(periodo: Periodo, proveedor: Proveedor) {
    this.store.dispatch(
      new fromActions.LoadFacturas({ periodo, proveedorId: proveedor.id })
    );
  }

  onPeriodoChange(periodo: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodo({ periodo }));
  }

  onSelection(event: any[]) {
    this.selected = event;
  }
}
