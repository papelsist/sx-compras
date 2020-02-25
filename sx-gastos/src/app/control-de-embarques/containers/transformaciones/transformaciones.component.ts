import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { EnviosFilter, Transformacion } from '../../model';
import { Periodo } from 'app/_core/models/periodo';
import { MatDialog } from '@angular/material';
import { TransformacionService } from 'app/control-de-embarques/services';
import { finalize } from 'rxjs/operators';
import { TransformacionFormComponent } from 'app/control-de-embarques/components';

@Component({
  selector: 'sx-transformaciones',
  template: `
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <mat-card >
      <sx-search-title title="Transformaciones de maquila " (search)="search = $event">
        <!-- <sx-envios-filter-btn [filter]="filter$ | async" class="options"
          (change)="onFilter($event)">
        </sx-envios-filter-btn> -->
        <sx-periodo-picker [periodo]="periodo" (change)="onFilter($event)" class="options"></sx-periodo-picker>
        <button mat-menu-item color="primary" (click)="load()" class="actions">
          <mat-icon>refresh</mat-icon>
          <span>Refrescar</span>
        </button>
      </sx-search-title>
      <mat-divider></mat-divider>
      <div class="table-panel">
        <sx-transformaciones-table [partidas]="transformaciones$ | async" (select)="onSelect($event)">
        </sx-transformaciones-table>

      </div>
    </mat-card>

  </ng-template>
  `,
  styles: [
    `
      .table-panel {
        min-height: 400px;
        height: 600px;
      }
      .table-det-panel {
        min-height: 200px;
      }
    `
  ]
})
export class TransformacionesComponent implements OnInit {
  envioComisiones$: Observable<Transformacion[]>;
  _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();
  filter$: Observable<EnviosFilter>;
  search = '';
  periodo: Periodo;

  transformaciones$: Observable<Transformacion[]>;

  constructor(
    private dialog: MatDialog,
    private service: TransformacionService
  ) {}

  ngOnInit() {
    this.periodo = Periodo.fromStorage(
      'sx.gastos.fletes.transformaciones.periodo',
      Periodo.monthToDay()
    );
    this.load();
  }

  onSelect(event: Transformacion) {
    console.log('Editando: ', event);
    this.dialog
      .open(TransformacionFormComponent, {
        data: { transformacion: event },
        width: '550px'
      })
      .afterClosed()
      .subscribe(trs => {
        if (trs) {
          this.doUpdate(trs);
        }
      });
  }

  doUpdate(changes: { id: string; changes: Partial<Transformacion> }) {
    this.service
      .update(changes)
      .subscribe(ok => this.load(), err => console.log('Err: ', err));
  }

  onSearch(event: string) {}

  onFilter(event: Periodo) {
    this.periodo = event;
    Periodo.saveOnStorage(
      'sx.gastos.fletes.transformaciones.periodo',
      this.periodo
    );
    this.load();
  }

  onPrint(event: Transformacion) {}

  load() {
    this._loading$.next(true);
    this.transformaciones$ = this.service
      .list(this.periodo)
      .pipe(finalize(() => this._loading$.next(false)));
  }
}
