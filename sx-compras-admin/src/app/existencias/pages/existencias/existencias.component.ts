import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import { Update } from '@ngrx/entity';

import { Observable } from 'rxjs';

import { Existencia } from 'app/existencias/models';

import { MatDialog } from '@angular/material';
import {
  TdLoadingService,
  TdMediaService,
  TdDialogService
} from '@covalent/core';
import { finalize } from 'rxjs/operators';

 // tslint:disable-next-line:max-line-length
 import {ExistenciaSemanaReportDialogComponent} from './components/existencia-semana-report-dialog/existencia-semana-report-dialog.component';
import { ExistenciaService } from '../../services/existencia.service';

@Component({
  selector: 'sx-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExistenciasComponent implements OnInit {
  rows$: Observable<Existencia[]>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService,
    private dialog: MatDialog,
    private loadingService: TdLoadingService,
    private service: ExistenciaService
    ) {}

  ngOnInit() {
    // this.periodo$ = this.store.pipe(select(fromStore.selectPeriodo));
    this.loading$ = this.store.pipe(select(fromStore.selectExistenciasLoading));
    this.rows$ = this.store.pipe(select(fromStore.getAllExistencias));
  }



  onReload() {
    this.store.dispatch(new fromStore.LoadExistencias());
  }

  onSelect(event: Partial<Existencia>) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['inventarios/existencias', event.id] })
    );
  }

  generarReporteExistenciaSemana() {
    const dialogRef = this.dialog
      .open(ExistenciaSemanaReportDialogComponent, {
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.doRunReporteExistenciaSemana(res);
        }
      });
  }

  doRunReporteExistenciaSemana(params) {
    this.loadingService.register('procesando');
    this.service.existenciaSemana(params)
    .pipe(
      finalize(() => this.loadingService.resolve('procesando'))
    ).subscribe(
      res => {
        const blob = new Blob([res], {
          type: 'application/pdf'
        });
        const fileURL = window.URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      },
      error2 => console.error(error2)
    );
  }
}
