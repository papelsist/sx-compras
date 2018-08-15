import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/notas.actions';
import * as fromAplicaciones from '../../store/actions/aplicaciones.actions';

import { Observable } from 'rxjs';
import { switchMap, map, filter, pluck, tap } from 'rxjs/operators';

import { TdDialogService } from '@covalent/core';

import { NotaDeCreditoCxP } from '../../model/notaDeCreditoCxP';
import {
  ComprobanteFiscalService,
  CuentaPorPagarService
} from '../../services';
import { AplicacionDePago, CuentaPorPagar } from '../../model';
import { MatDialog } from '@angular/material';
import { AplicacionFormComponent } from '../../components';

@Component({
  selector: 'sx-nota',
  template: `
    <div *ngIf="nota$ | async as nota">
      <sx-nota-form [nota]="nota"
        (save)="onSave($event)"
        (delete)="onDelete($event)"
        (aplicar)="onAplicar($event)"
        (pdf)="onPdf($event)"
        [cuentasPorPagar]="facturasPendientes$ | async"
        (agregarAplicaciones)="onAgregarAplicacion(nota, $event)"
        (quitarAplicacion)="onQuitarAplicacion($event)">

      </sx-nota-form>
    </div>
  `
})
export class NotaComponent implements OnInit, OnDestroy {
  nota$: Observable<NotaDeCreditoCxP>;
  facturasPendientes$: Observable<CuentaPorPagar[]>;
  constructor(
    private store: Store<fromStore.CxpState>,
    private dialogService: TdDialogService,
    private service: ComprobanteFiscalService,
    private facturasService: CuentaPorPagarService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.nota$ = this.store.pipe(select(fromStore.getSelectedNota));
    this.facturasPendientes$ = this.nota$.pipe(
      filter(res => !!res),
      switchMap(nota => {
        return this.facturasService.pendientes(nota.proveedor.id);
      })
    );
  }

  ngOnDestroy() {}

  onSave(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.UpdateNota(event));
  }

  onDelete(event: NotaDeCreditoCxP) {
    this.store.dispatch(new fromActions.DeleteNota(event));
  }

  onAplicar(event: NotaDeCreditoCxP) {
    this.dialogService
      .openConfirm({
        message: `Disponible $ ${event.disponible} `,
        title: 'Aplicar nota de crédito?',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.AplicarNota(event));
        }
      });
  }

  onAgregarAplicacion(nota: NotaDeCreditoCxP, event: CuentaPorPagar[]) {
    console.log('Generando aplicaciones para: ', event);
    this.dialog
      .open(AplicacionFormComponent, {
        data: { cxp: event[0], disponible: nota.disponible },
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        const cxp = event[0];
        const aplicacion: AplicacionDePago = {
          cxp: { id: cxp.id },
          nota: { id: nota.id },
          ...res
        };
        this.store.dispatch(new fromAplicaciones.AddAplicacion(aplicacion));
      });
  }

  onQuitarAplicacion(event: AplicacionDePago) {
    this.dialogService
      .openConfirm({
        message: `Importe aplicado:   ${event.importe} `,
        title: 'Cancelar aplicación?',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromAplicaciones.DeleteAplicacionDeNota(event)
          );
        }
      });
  }

  onPdf(event: NotaDeCreditoCxP) {
    this.service.imprimirCfdi(event.comprobanteFiscal.id);
  }
}
