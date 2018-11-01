import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions';

import { Observable } from 'rxjs';

import { Ficha, FichaFilter } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

import { TdDialogService } from '@covalent/core';
import { FormBuilder, Form } from '@angular/forms';

@Component({
  selector: 'sx-fichas',
  template: `
    <mat-card>
      <sx-search-title title="Fichas registrados" (search)="search = $event">
        <sx-fichas-filter [filter]="filter$ | async" class="options"></sx-fichas-filter>
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent" class="actions" (click)="generar()">
          <mat-icon>perm_data_setting</mat-icon> Generar
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>

      <sx-fichas-table [fichas]="fichas$ | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        (ingreso)="onIngreso($event)"
        [filter]="search">
      </sx-fichas-table>
      <mat-card-footer>

      </mat-card-footer>
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
export class FichasComponent implements OnInit {
  fichas$: Observable<Ficha[]>;
  search = '';
  filter$: Observable<FichaFilter>;
  form: Form;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.fichas$ = this.store.pipe(select(fromStore.getAllFichas));
    this.filter$ = this.store.pipe(select(fromStore.getFichasFilter));
  }

  onFilterChange(filter: any) {
    this.store.dispatch(new fromStore.SetFichasFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadFichas());
  }

  generar() {}

  onIngreso(event: Ficha) {}

  onEdit(event: Ficha) {}

  onDelete(event: Ficha) {}
}
