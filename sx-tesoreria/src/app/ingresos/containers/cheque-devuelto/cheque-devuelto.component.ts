import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/cheque-devuelto.actions';

import { Observable } from 'rxjs';

import { ChequeDevuelto, CobroCheque } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { PeriodoFilter } from 'app/models';
import { SelectorDeCobrosChequeComponent } from 'app/ingresos/components/selecor-de-cheques/selector-de-cobros-cheques.component';
import { ChequeDevueltoFormComponent } from 'app/ingresos/components';
import { FechaDialogComponent } from 'app/_shared/components';
import { ChequeDevueltoService } from 'app/ingresos/services';

@Component({
  selector: 'sx-cheque-devuelto',
  template: `
  <div layout>
    <mat-card *ngIf="cheque$ | async as cheque">
      <mat-card-title>{{cheque.nombre}}</mat-card-title>
      <mat-card-subtitle>
        CHEQUE DEVUELTO
      </mat-card-subtitle>
      <mat-divider></mat-divider>
        <div layout="column" class="pad">

          <mat-form-field>
            <input matInput placeholder="Cuenta" [value] = "cheque.cuenta" [readOnly]="true">
          </mat-form-field>

          <mat-form-field>
            <input matInput placeholder="Número" [value]="cheque.folio" [readOnly]="true">
          </mat-form-field>

          <mat-form-field>
            <input matInput placeholder="Importe" [value]="cheque.importe" [readOnly]="true">
          </mat-form-field>

          <mat-form-field>
            <input matInput placeholder="Comentario" [value] = "cheque.comentario" [readOnly]="true">
          </mat-form-field>

          <ng-container *ngIf="cheque.notaDeCargo">
            <mat-form-field>
              <input matInput placeholder="CFDI" value = "{{cheque?.notaDeCargo?.cfdi?.uuid}}" [readOnly]="true" >
            </mat-form-field>
          </ng-container>

        </div>
      <mat-card-actions>
        <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" [tdLoadingStrategy]="'overlay'">
          <button mat-raised-button color="primary" *ngIf="!cheque.notaDeCargo" (click)="generarNota(cheque)">
          <mat-icon>settings</mat-icon> GENERAR NOTA
          </button>
        </ng-template>
        <ng-container *ngIf="cheque.notaDeCargo">
          <button mat-raised-button color="primary"
            (click)="onImprimir(cheque.notaDeCargo.cfdi.id)" >
            <mat-icon>print</mat-icon> IMPRIMIR CFDI
          </button>
          <button mat-raised-button (click)="onXml(cheque)">
            <mat-icon>settings_ethernet</mat-icon> CFDI XML
          </button>
        </ng-container>
      </mat-card-actions>
    </mat-card>
  </div>


  `,
  styles: [
    `
      /*.mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
      */
    `
  ]
})
export class ChequeDevueltoComponent implements OnInit {
  cheque$: Observable<ChequeDevuelto>;
  loading$: Observable<boolean>;
  search = '';

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService,
    private servic: ChequeDevueltoService
  ) {}

  ngOnInit() {
    this.cheque$ = this.store.pipe(select(fromStore.getSelectedChequeDevuelto));
    this.loading$ = this.store.pipe(
      select(fromStore.getChequeDevueltosLoading)
    );
  }

  onSelect() {}

  onDelete(event: ChequeDevuelto) {
    this.dialogService
      .openConfirm({
        message: `Cheque devuelto ${event.folio} ${event.nombre} `,
        title: 'Eliminar cheque devuelto',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromActions.DeleteChequeDevuelto({ cheque: event })
          );
        }
      });
  }

  generarNota(cheque: ChequeDevuelto) {
    this.dialogService
      .openConfirm({
        title: 'NOTA DE CARGO',
        message: 'GENERAR LA NOTA DE CARGO?',
        acceptButton: 'ACEPTAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.GenerarNotaDeCargo({ cheque }));
        }
      });
  }

  onImprimir(id: string) {
    this.reportService.runReport(`cfdi/print/${id}`, {});
  }
  onXml(cheque: ChequeDevuelto) {
    if (cheque.notaDeCargo && cheque.notaDeCargo.cfdi) {
      this.servic.mostrarXml(cheque.notaDeCargo.cfdi.id);
    }
  }
}
