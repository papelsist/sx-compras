import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../store/estado-de-cuenta.reducer';
import * as fromActions from '../store/ecuenta.actions';

// import * as fromStore from '../../store';

import { Observable, Subject } from 'rxjs';

import { Periodo } from '../../../_core/models/periodo';
import { CuentaPorPagar } from '../../model';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { ProveedorUtilsService } from 'app/proveedores/services/proveedor-utils.service';
import { takeUntil, map, withLatestFrom, switchMap } from 'rxjs/operators';

@Component({
  selector: 'sx-ecuenta-page',
  templateUrl: './ecuenta-page.component.html',
  styleUrls: ['./ecuenta-page.component.scss']
})
export class EcuentaPageComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  facturas$: Observable<CuentaPorPagar[]>;
  periodo$: Observable<Periodo>;
  destroy$ = new Subject<boolean>();

  proveedor: Proveedor;
  // proveedor$ = new Subject<Proveedor>();
  proveedor$: Observable<Proveedor>;

  selected: Partial<CuentaPorPagar>[] = [];

  constructor(
    private store: Store<fromStore.State>,
    private provedorUi: ProveedorUtilsService
  ) {}

  ngOnInit() {
    // this.loading$ = this.store.pipe(select(fromStore.getFacturasLoading));
    this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.proveedor$ = this.store.pipe(select(fromStore.selectProveedor));

    this.proveedor$
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => (this.proveedor = p));

    /*
    this.facturas$ = this.proveedor$.pipe(withLatestFrom( proveedor => proveedor.id), switchMap(id => {
      return this.store.pipe(
        select(fromStore.selectCartera),
        map(f => f(id)),
      );
    }));
    */
    // this.facturas$ = this.store.pipe(
    //   select(fromStore.selectCartera),
    //   map(f => f('data')),
    // );
  }

  ngOnDestroy() {
    // this.proveedor$.next(null);
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  seleccionar() {
    this.provedorUi.seleccionar().subscribe(res => {
      if (res) {
        // this.proveedor$.next(res);
        this.store.dispatch(new fromActions.SetProveedor({ proveedor: res }));
      }
    });
  }

  reload() {
    // this.store.dispatch(new fromActions.LoadFacturas());
  }

  onSelection(event: Partial<CuentaPorPagar>[]) {
    this.selected = event;
  }

  ajustarDiferencia(facturas: Partial<CuentaPorPagar>[]) {
    console.log('Ajustar diferencias....', facturas.length);
    facturas.forEach(item => {
      // this.store.dispatch(new fromActions.SaldarCuentaPorPagar(item));
    });
  }
}
