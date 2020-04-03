import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';

import {
  AnalisisDeTransformacion,
  AnalisisDeTransformacionDet,
  CuentaPorPagar
} from 'app/cxp/model';
import {
  FacturaSelectorComponent,
  SelectorDeTrsComponent
} from 'app/cxp/components';
import { AnalisisDeTrsService } from 'app/cxp/services/analisis-de-trs.service';

import * as _ from 'lodash';

@Component({
  selector: 'sx-analisis-de-transformacion',
  templateUrl: './analisis-de-transformacion.component.html',
  styleUrls: ['./analisis-de-transformacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalisisDeTransformacionComponent implements OnInit {
  loading$: Observable<boolean>;
  analisis$: Observable<AnalisisDeTransformacion>;
  selected: AnalisisDeTransformacionDet[] = [];

  constructor(
    private store: Store<fromStore.CxpState>,
    private service: AnalisisDeTrsService,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.analisis$ = this.store.pipe(
      select(fromStore.selectCurrentAnalisisDeTrs)
    );

    this.loading$ = this.store.pipe(
      select(fromStore.selectAnalisisDeTransformacionLoading)
    );
  }

  back() {
    this.store.dispatch(new fromRoot.Back());
  }

  onSelectionChange(event: AnalisisDeTransformacionDet[]) {
    this.selected = event;
  }

  onDelete(analisis: AnalisisDeTransformacion) {
    this.dialogService
      .openConfirm({
        title: 'ELIMINAR ANALISIS',
        message: `ANALISIS ${analisis.id}`,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.DeleteAnalisisDeTransformacion({ id: analisis.id })
          );
        }
      });
  }

  onUpdate(event: Update<AnalisisDeTransformacion>) {
    console.log(
      'Update: ',
      event.changes.partidas.map(item => [item.cantidad, item.importe])
    );
    this.store.dispatch(
      new fromStore.UpdateAnalisisDeTransformacion({ analisis: event })
    );
    this.selected = [];
  }

  agregarPartidas(analisis: AnalisisDeTransformacion) {
    this.selected = [];
    this.service
      .pendientes()
      .subscribe(
        res => this.doAgregarPartidas(analisis, res),
        error => console.error('Error: ', error)
      );
  }

  private doAgregarPartidas(analisis: AnalisisDeTransformacion, trs: any[]) {
    this.dialog
      .open(SelectorDeTrsComponent, {
        data: { trs },
        width: '80%'
      })
      .afterClosed()
      .subscribe((res: any[]) => {
        if (res) {
          const partidas = _.concat(analisis.partidas, res);
          this.store.dispatch(
            new fromStore.UpdateAnalisisDeTransformacion({
              analisis: { id: analisis.id, changes: { partidas } }
            })
          );
        }
      });
  }

  onDeletePartidas(
    analisis: AnalisisDeTransformacion,
    rows: AnalisisDeTransformacionDet[]
  ) {
    const partidas = _.pullAllBy(analisis.partidas, rows, 'id');
    this.store.dispatch(
      new fromStore.UpdateAnalisisDeTransformacion({
        analisis: { id: analisis.id, changes: { partidas } }
      })
    );
    this.selected = [];
  }

  seleccionarFactura(analisis: AnalisisDeTransformacion) {
    this.selected = [];
    this.service
      .facturasPendientes(analisis.proveedor.id)
      .subscribe(
        facturas => this.doSeleccionarFactura(analisis, facturas),
        error =>
          this.store.dispatch(new fromRoot.GlobalHttpError({ response: error }))
      );
  }

  doSeleccionarFactura(
    analisis: AnalisisDeTransformacion,
    facturas: CuentaPorPagar[]
  ) {
    const dialogRef = this.dialog.open(FacturaSelectorComponent, {
      data: {
        title: 'Facturas pendientes de analizar',
        facturas
      },
      width: '850px'
    });
    dialogRef.afterClosed().subscribe((res: CuentaPorPagar[]) => {
      if (res && res.length > 0) {
        const cxp = { id: res[0].id };
        const update = { id: analisis.id, changes: { cxp } };
        this.store.dispatch(
          new fromStore.UpdateAnalisisDeTransformacion({ analisis: update })
        );
      }
    });
  }

  cerrarAnalisis(analisis: AnalisisDeTransformacion) {
    this.selected = [];
    if (!analisis.cerrada) {
      this.dialogService
        .openConfirm({
          title: 'CIERRE DE ANALSIS',
          message: `CERRAR ANALSIS:  ${analisis.id}`,
          acceptButton: 'CERRAR',
          cancelButton: 'CANCELAR'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            const update = {
              id: analisis.id,
              changes: { cerrada: new Date().toISOString() }
            };
            this.store.dispatch(
              new fromStore.UpdateAnalisisDeTransformacion({ analisis: update })
            );
          }
        });
    }
  }

  onPartidaChange(
    analisis: AnalisisDeTransformacion,
    partida: Update<AnalisisDeTransformacionDet>
  ) {
    const partidas = [...analisis.partidas];
    partidas.forEach(item => {
      if (item.id === partida.id) {
        const cantidad = partida.changes.cantidad.toString();
        const importe = partida.changes.importe.toString();
        item.cantidad = parseFloat(cantidad);
        item.importe = partida.changes.importe;
      }
    });

    const update = { id: analisis.id, changes: { partidas } };
    this.onUpdate(update);
  }
}
