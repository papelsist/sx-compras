import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Cobro, CobrosFilter } from '../../models';
import { ReportService } from 'app/reportes/services/report.service';

import { MatDialog } from '@angular/material';

@Component({
  selector: 'sx-cobros',
  template: `
    <mat-card>
      <sx-search-title title="Cobros registrados" (search)="search = $event">
        <!--
          <sx-cobros-filter-btn class="options" [filter]="filter$ | async" (change)="onFilterChange($event)"></sx-cobros-filter-btn>
        -->
        <button mat-menu-item class="actions" (click)="reload()"><mat-icon>refresh</mat-icon> Recargar</button>
        <a mat-menu-item  color="accent"[routerLink]="['create']" class="actions">
          <mat-icon>add</mat-icon> Nuevo cobro
        </a>
      </sx-search-title>
      <mat-divider></mat-divider>
<<<<<<< HEAD
      <sx-cobros-table [cobros]="cobros$ | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
        [filter]="search">
      </sx-cobros-table>
=======
      <sx-cobros-table [cobros]="cobros$ | async" (edit)="onEdit($event)"></sx-cobros-table>
>>>>>>> a7924d9233ac979ac3a9c09471307ac3f9e4d3cf
      <mat-card-footer>
        <!--
        <sx-cobros-filter-label [filter]="filter$ | async"></sx-cobros-filter-label>
        -->
      </mat-card-footer>
      <a mat-fab matTooltip="Alta de cobro" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      [routerLink]="['create']">
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
export class CobrosComponent implements OnInit {
  cobros$: Observable<Cobro[]>;
  search = '';
  filter$: Observable<CobrosFilter>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.cobros$ = this.store.pipe(select(fromStore.getAllCobros));
    this.filter$ = this.store.pipe(select(fromStore.getCobrosFilter));
  }

  onSelect() {}

  onFilterChange(filter: CobrosFilter) {
    this.store.dispatch(new fromStore.SetCobrosFilter({ filter }));
  }

  reload() {
    this.store.dispatch(new fromStore.LoadCobros());
  }

  onEdit(event: Cobro) {
<<<<<<< HEAD
    this.dialog
      .open(CobroFormComponent, { data: { cobro: event }, width: '750px' })
      .afterClosed()
      .subscribe((changes: Partial<Cobro>) => {
        if (changes) {
          this.store.dispatch(
            new fromActions.UpdateCobro({ cobro: { id: event.id, changes } })
          );
        }
      });
  }

  onDelete(event: Cobro) {
    this.dialogService
      .openConfirm({
        message: `Cobro ${event.nombre} por ${event.importe}`,
        title: 'Eliminar cobro',
        acceptButton: 'Aceptar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromActions.DeleteCobro({ cobro: event }));
        }
      });
=======
    this.store.dispatch(new fromRoot.Go({ path: [event.id] }));
>>>>>>> a7924d9233ac979ac3a9c09471307ac3f9e4d3cf
  }
}
