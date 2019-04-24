import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromEstadoDeCuenta from '../../store/selectors/estado-de-cuenta.selectors';

import { Observable, Subject } from 'rxjs';

import { MatDialog } from '@angular/material';

import {
  FacturistaDeEmbarque,
  FacturistaEstadoDeCuenta
} from 'app/control-de-embarques/model';
import {
  SelectorDeFacturistaComponent,
  PrestamoInteresesFormComponent,
  ComisionesPorFacturistaDialogComponent
} from 'app/control-de-embarques/components';
import { TdDialogService } from '@covalent/core';
import { ReportService } from 'app/reportes/services/report.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sx-estado-de-cuenta-facturista',
  templateUrl: './estado-de-cuenta.component.html',
  styles: [
    `
      .ec-icon {
        padding: 0 14px;
      }
      .table-panel {
        max-height: 50px;
      }
    `
  ]
})
export class EstadoDeCuentaComponent implements OnInit, OnDestroy {
  facturistas$: Observable<FacturistaDeEmbarque[]>;
  selected$: Observable<FacturistaDeEmbarque>;
  movimientos$: Observable<FacturistaEstadoDeCuenta[]>;
  loading$: Observable<boolean>;
  selected: FacturistaDeEmbarque;

  destroy$ = new Subject<boolean>();

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService,
    private service: ReportService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getEstadoDeCuentaLoading));
    this.facturistas$ = this.store.pipe(select(fromStore.getAllFacturistas));

    this.selected$ = this.store.pipe(
      select(fromEstadoDeCuenta.getSelectedFacturista)
    );

    this.store
      .pipe(
        takeUntil(this.destroy$),
        select(fromEstadoDeCuenta.getSelectedFacturista)
      )
      .subscribe(facturista => (this.selected = facturista));

    this.movimientos$ = this.store.pipe(
      select(fromStore.getAllRowsEstadoDeCuenta)
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  select(facturistas: FacturistaDeEmbarque[]) {
    this.dialog
      .open(SelectorDeFacturistaComponent, {
        data: { facturistas },
        width: '650px'
      })
      .afterClosed()
      .subscribe(facturista => {
        if (facturista) {
          this.load(facturista);
        }
      });
  }

  load(facturista: FacturistaDeEmbarque) {
    this.store.dispatch(new fromStore.SetFacturista({ facturista }));
  }

  calcularIntereses(facturista?: FacturistaDeEmbarque) {
    this.dialog
      .open(PrestamoInteresesFormComponent, {
        data: {
          facturista
        }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.GenerarIntereses(res));
        }
      });
  }

  generarNotaDeCargo(facturista: FacturistaDeEmbarque) {
    this.dialogService
      .openConfirm({
        title: 'NOTA DE CARGO',
        message: 'GENERAR NOTA DE CARGO POR INTERESES',
        acceptButton: 'ACEPTAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.GenerarNotaDeCargo({ facturistaId: facturista.id })
          );
        }
      });
  }

  print(facturista?: FacturistaDeEmbarque) {
    this.dialog
      .open(ComisionesPorFacturistaDialogComponent, {
        data: {
          title: 'Estado de cuenta',
          facturista
        },
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.service.runReport(
            'embarques/facturistaEstadoDeCuenta/estadoDeCuenta',
            res
          );
        }
      });
  }
}
