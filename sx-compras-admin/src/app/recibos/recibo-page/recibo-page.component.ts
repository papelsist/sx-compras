import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../store';

import { Observable } from 'rxjs';

import { Recibo, ReciboDet } from '../models';
import { Update } from '@ngrx/entity';
import { TdDialogService } from '@covalent/core';

import { pluck, filter } from 'rxjs/operators';
import { Requisicion } from 'app/cxp/model';
import { MatDialog } from '@angular/material';
import { SelectorRequisicionesComponent } from '../selector-requisiciones/selector-requisiciones.component';
import { ReciboService } from '../services/recibo.service';

@Component({
  selector: 'sx-recibo-page',
  templateUrl: './recibo-page.component.html',
  styleUrls: ['./recibo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReciboPageComponent implements OnInit {
  loading$: Observable<boolean>;
  recibo$: Observable<Recibo>;
  partidas$: Observable<ReciboDet[]>;
  requisicion$: Observable<any>;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService,
    private dialog: MatDialog,
    private service: ReciboService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.selectRecibosLoading));

    this.recibo$ = this.store.pipe(select(fromStore.getCurrentRecibo));

    this.partidas$ = this.recibo$.pipe(
      filter(r => !!r),
      pluck('partidas')
    );
    this.requisicion$ = this.recibo$.pipe(
      filter(r => !!r),
      pluck('requisicion')
    );
  }

  onBack() {
    this.store.dispatch(new fromRoot.Back());
  }

  onUpdate(recibo: Update<Recibo>) {
    this.store.dispatch(new fromStore.UpdateRecibo({ update: recibo }));
  }

  onRevision(recibo: Partial<Recibo>) {
    this.dialogService
      .openConfirm({
        title: 'VALIDAR RECIBO',
        message: 'REVISION SATISFACTORIA DEL CFDI',
        acceptButton: 'VALIDAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const update: Update<Recibo> = {
            id: recibo.id,
            changes: { revision: new Date().toISOString() }
          };
          this.store.dispatch(new fromStore.UpdateRecibo({ update }));
        }
      });
  }

  asignarRequisicion(recibo: Partial<Recibo>) {
    this.service.requisicionesPendientes(recibo).subscribe(
      res => {
        this.dialog
          .open(SelectorRequisicionesComponent, {
            data: { proveedor: recibo.emisor, requisiciones: res },
            width: '650px'
          })
          .afterClosed()
          .subscribe(data => {
            if (data) {
              this.store.dispatch(
                new fromStore.AsignarRequisicionRecibo({
                  reciboId: recibo.id,
                  requisicionId: data.id
                })
              );
            }
          });
      },
      error => console.error('Error: ', error)
    );
  }

  onQuitarRequisicion(
    requisicion: Partial<Requisicion>,
    recibo: Partial<Recibo>
  ) {
    if (!recibo.revision) {
      this.dialogService
        .openConfirm({
          title: 'QUITAR REQUISICIÓN',
          message: 'FOLIO: ' + requisicion.folio,
          acceptButton: 'QUITAR',
          cancelButton: 'CANCELAR'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            this.store.dispatch(
              new fromStore.QuitarRequisicionRecibo({ reciboId: recibo.id })
            );
          }
        });
    }
  }
}
