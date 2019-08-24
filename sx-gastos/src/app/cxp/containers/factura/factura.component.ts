import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';

import { MatDialog } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { Update } from '@ngrx/entity';

import { Observable, from, of } from 'rxjs';
import { pluck, tap, delay, concatMap, filter } from 'rxjs/operators';

import { CuentaPorPagar, GastoDet } from 'app/cxp/model';
import {
  CxpGastoSelectorComponent,
  CxPGastodetModalComponent,
  CxpProrrateoModalComponent
} from 'app/cxp/components';

@Component({
  selector: 'sx-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacturaComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  factura$: Observable<CuentaPorPagar>;
  cfdiConceptos$: Observable<any[]>;
  gastos$: Observable<GastoDet[]>;
  selected: Partial<GastoDet[]> = [];

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getGastosLoading));
    this.factura$ = this.store.pipe(
      select(fromStore.getSelectedFactura),
      tap(factura => {
        if (factura) {
          this.store.dispatch(
            new fromStore.LoadGastos({ facturaId: factura.id })
          );
        }
      })
    );
    this.cfdiConceptos$ = this.factura$.pipe(
      filter(factura => !!factura),
      pluck('comprobanteFiscal'),
      pluck('conceptos')
    );

    this.gastos$ = this.store.pipe(select(fromStore.getAllGastos));
  }

  ngOnDestroy() {
    this.store.dispatch(new fromStore.ClearGastos());
  }

  onBack() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSelectionChange(event: Partial<GastoDet[]>) {
    this.selected = event;
  }

  agregarConceptos(cxp: Partial<CuentaPorPagar>, conceptos: any[]) {
    this.dialog
      .open(CxpGastoSelectorComponent, {
        data: { conceptos, cxp },
        width: '800px'
      })
      .afterClosed()
      .subscribe((gastos: GastoDet[]) => {
        if (gastos) {
          from(gastos)
            .pipe(
              concatMap(item => of(item).pipe(delay(500))) // Small delay
            )
            .subscribe(gasto =>
              this.store.dispatch(new fromStore.CreateGasto({ gasto }))
            );
        }
      });
  }

  quitarConceptos(conceptos: Partial<GastoDet[]>) {
    from(conceptos)
      .pipe(
        concatMap(item => of(item.id).pipe(delay(500))) // Small delay
      )
      .subscribe(gastoId =>
        this.store.dispatch(new fromStore.DeleteGasto({ gastoId }))
      );
  }

  editGastoDet(factura: Partial<CuentaPorPagar>, gasto: Partial<GastoDet>) {
    this.dialog
      .open(CxPGastodetModalComponent, {
        data: { factura, gasto },
        width: '750px'
        // height: '645px'
      })
      .afterClosed()
      .subscribe((changes: Partial<GastoDet>) => {
        if (changes) {
          this.store.dispatch(
            new fromStore.UpdateGasto({ gasto: { id: gasto.id, changes } })
          );
        }
      });
  }

  onProrratear(gastos: GastoDet[]) {
    const gasto = gastos[0];
    this.dialog
      .open(CxpProrrateoModalComponent, {
        data: { gastoDet: gasto },
        width: '650px'
      })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          this.store.dispatch(
            new fromStore.ProrratearPartida({ gastoDetId: gasto.id, data })
          );
        }
      });
  }
}
