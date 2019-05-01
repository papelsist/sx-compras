import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { MatDialog } from '@angular/material';

import { FacturistaDeEmbarque } from 'app/control-de-embarques/model';

import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-facturistas',
  template: `
  <mat-card >
    <sx-search-title title="Facturistas  " (search)="onSearch($event)"></sx-search-title>
    <mat-divider></mat-divider>
    <div class="table-panel">
      <sx-facturistas-table
        [facturistas]="facturistas$ | async"
        [filter]="filter$ | async"
        (edit)="onEdit($event)">
      </sx-facturistas-table>
      <!--
      <sx-prestamos-table #table
        [prestamos]="prestamos$ | async"
        [filter]="search$ | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)">
      </sx-prestamos-table>
      -->
    </div>
  </mat-card>
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <a mat-fab matTooltip="Nuevo facturista" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
      (click)="onCreate() ">
    <mat-icon>add</mat-icon>
    </a>
  </ng-template>
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
export class FacturistasComponent implements OnInit {
  loading$: Observable<boolean>;
  facturistas$: Observable<FacturistaDeEmbarque[]>;
  filter$ = new Subject<string>();
  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getEnvioComisionLoading));
    this.facturistas$ = this.store.pipe(select(fromStore.getAllFacturistas));
  }

  onSearch(event: string) {
    this.filter$.next(event);
  }

  onCreate() {}

  onEdit(event: FacturistaDeEmbarque) {
    this.store.dispatch(
      new fromRoot.Go({ path: ['embarques/facturistas', event.id] })
    );
  }

  onDelete(event: FacturistaDeEmbarque) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar facturista',
        message: event.nombre,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.DeleteFacturista({ facturistaId: event.id })
          );
        }
      });
  }
}
