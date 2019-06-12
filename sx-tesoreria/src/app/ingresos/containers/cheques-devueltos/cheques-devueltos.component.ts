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

import * as moment from 'moment';

@Component({
  selector: 'sx-cheques-devueltos',
  template: `
    <mat-card>
      <sx-search-title title="Registro de cheques devueltos" (search)="search = $event">
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent" (click)="onCreate()" class="actions">
          <mat-icon>add</mat-icon> Nuevo
        </a>
        <button mat-menu-item class="actions" (click)="runReport()">
          <mat-icon>picture_as_pdf</mat-icon> Reporte de cheques
        </button>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-cheques-devueltos-table [cheques]="cheques$ | async" (edit)="onEdit($event)" (delete)="onDelete($event)" [filter]="search">
      </sx-cheques-devueltos-table>

      <a mat-fab matTooltip="Alta de cheque" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      (click)="onCreate()">
    <mat-icon>add</mat-icon>
    </a>
    </mat-card>

  `,
  styles: [
    `
      .mat-card {
        width: calc(100% - 15px);
        height: calc(100% - 10px);
      }
    `
  ]
})
export class ChequesDevueltosComponent implements OnInit {
  cheques$: Observable<ChequeDevuelto[]>;
  search = '';
  filter$: Observable<PeriodoFilter>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.cheques$ = this.store.pipe(select(fromStore.getAllChequeDevueltos));
    this.filter$ = this.store.pipe(select(fromStore.getChequeDevueltosFilter));
  }

  onSelect() {}

  onFilterChange(filter: PeriodoFilter) {
    this.store.dispatch(new fromActions.SetChequeDevueltosFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromActions.LoadChequeDevueltos());
  }

  onCreate() {
    this.dialog
      .open(SelectorDeCobrosChequeComponent, { data: {}, width: '750px' })
      .afterClosed()
      .subscribe(selected => {
        if (selected) {
          this.doGenerate(selected[0]);
        }
      });
  }

  doGenerate(cobro: CobroCheque) {
    this.dialog
      .open(ChequeDevueltoFormComponent, {
        data: { cobro: cobro },
        width: '650px'
      })
      .afterClosed()
      .subscribe(command => {
        if (command) {
          const cheque: ChequeDevuelto = {
            cheque: { id: cobro.id },
            fecha: command.fecha
          };
          this.store.dispatch(new fromActions.CreateChequeDevuelto({ cheque }));
        }
      });
  }

  onEdit(event: ChequeDevuelto) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['ingresos/chequesdevueltos', event.id] })
    );
  }

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

  runReport() {
    const dialogRef = this.dialog.open(FechaDialogComponent, {
      data: { title: 'Reporte de cheques devueltos' }
    });
    dialogRef.afterClosed().subscribe((fecha: Date) => {
      if (fecha) {
        this.reportService.runReport(
          'cxc/chequesDevuetos/reporteDeChequesDevueltos',
          {
            fecha: moment(fecha).format('DD/MM/YYYY')
          }
        );
        /*
        this.service.reporteDeChequesDevueltos(fecha).subscribe(
          res => {
            const blob = new Blob([res], {
              type: 'application/pdf'
            });
            const fileURL = window.URL.createObjectURL(blob);
            window.open(fileURL, '_blank');
          },
          error2 => console.log(error2)
        );
        */
      }
    });
  }
}
