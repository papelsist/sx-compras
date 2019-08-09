import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/compra.actions';

import { Observable } from 'rxjs';
import { Compra } from '../../models/compra';
import { Periodo } from 'app/_core/models/periodo';
import { MatDialog } from '@angular/material';
import { ComprasService } from 'app/ordenes/services';
import { ShowCompraDetsComponent } from 'app/ordenes/components/show-compradets/show-compradets.component';
import { CompraCreateModalComponent } from 'app/ordenes/components';
import { ReportService } from 'app/reportes/services/report.service';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-compras',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit, OnDestroy {
  compras$: Observable<Compra[]>;
  periodo$: Observable<Periodo>;
  loading$: Observable<boolean>;

  selected: Partial<Compra>[] = [];

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private service: ComprasService,
    private reportServive: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.periodo$ = this.store.pipe(select(fromStore.getComprasPeriodo));
    this.loading$ = this.store.pipe(select(fromStore.getComprasLoading));
    this.compras$ = this.store.pipe(select(fromStore.getAllCompras));
  }

  ngOnDestroy() {}

  onPeriodo(event: Periodo) {
    this.store.dispatch(new fromActions.SetPeriodo({ periodo: event }));
  }

  reload() {
    this.store.dispatch(new fromActions.LoadCompras());
  }

  onCreate() {
    // this.store.dispatch(new fromRoot.Go({ path: ['ordenes/compras/create'] }));
    this.dialog
      .open(CompraCreateModalComponent, {
        data: {},
        width: '700px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.AddCompra(res));
        }
      });
  }

  onSelect(event: Compra) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['ordenes/compras', event.id] })
    );
  }
  mostrarPartidas(coms: Partial<Compra>[]) {
    const ids = coms.map(item => item.id);
    this.service
      .partidas(ids)
      .subscribe(
        res => this.showPartidas(res),
        error => console.error('Error: ', error)
      );
  }

  showPartidas(data: any[]) {
    this.dialog
      .open(ShowCompraDetsComponent, {
        data: { partidas: data },
        width: '1250px'
      })
      .afterClosed()
      .subscribe(res => {});
  }

  onPrint(compra: Partial<Compra>) {
    this.dialogService
      .openConfirm({
        title: `Compra ${compra.folio}`,
        message: `Claves del proveedor`,
        acceptButton: 'Si',
        cancelButton: 'No'
      })
      .afterClosed()
      .subscribe(res => {
        this.imprimir(compra, res);
      });
  }

  private imprimir(compra: Partial<Compra>, clavesProveedor: boolean) {
    const params = { clavesProveedor };
    const url = `compras/print/${compra.id}`;
    this.reportServive.runReport(url, params);
  }
}
