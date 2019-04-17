import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromEstadoDeCuenta from '../../store/selectors/estado-de-cuenta.selectors';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';

import {
  FacturistaDeEmbarque,
  FacturistaEstadoDeCuenta
} from 'app/control-de-embarques/model';
import { SelectorDeFacturistaComponent } from 'app/control-de-embarques/components';

@Component({
  selector: 'sx-estado-de-cuenta-facturista',
  templateUrl: './estado-de-cuenta.component.html',
  styles: [
    `
      .ec-icon {
        padding: 0 14px;
      }
      .table-panel {
        min-height: 400px;
      }
      .table-det-panel {
        min-height: 200px;
      }
    `
  ]
})
export class EstadoDeCuentaComponent implements OnInit {
  facturistas$: Observable<FacturistaDeEmbarque[]>;
  selected$: Observable<FacturistaDeEmbarque>;
  movimientos$: Observable<FacturistaEstadoDeCuenta[]>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.facturistas$ = this.store.pipe(select(fromStore.getAllFacturistas));
    this.selected$ = this.store.pipe(
      select(fromEstadoDeCuenta.getSelectedFacturista)
    );
    this.movimientos$ = this.store.pipe(
      select(fromStore.getAllRowsEstadoDeCuenta)
    );
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
          // this.store.dispatch(new fromStore.SetFacturista({ facturista }));
          this.load(facturista);
        }
      });
  }

  load(facturista: FacturistaDeEmbarque) {
    this.store.dispatch(new fromStore.SetFacturista({ facturista }));
  }
}
