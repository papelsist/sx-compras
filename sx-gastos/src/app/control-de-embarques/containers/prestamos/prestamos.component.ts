import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Periodo } from 'app/_core/models/periodo';
import { MatDialog } from '@angular/material';

import {
  FacturistaPrestamo,
  FacturistaDeEmbarque
} from 'app/control-de-embarques/model';
import { PrestamoFormComponent } from 'app/control-de-embarques/components';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-prestamos',
  template: `
  <mat-card >
    <sx-search-title title="Prestamos  " (search)="onSearch($event)">
      <button mat-menu-item color="primary" (click)="reload(periodo)" class="actions" *ngIf="periodo$ | async as periodo">
        <mat-icon>refresh</mat-icon>
        <span>Refrescar</span>
      </button>

    </sx-search-title>
    <mat-divider></mat-divider>
    <div class="table-panel">
      <sx-prestamos-table #table
        [prestamos]="prestamos$ | async"
        [filter]="search$ | async"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)">
      </sx-prestamos-table>

    </div>
  </mat-card>
  <ng-template tdLoading [tdLoadingUntil]="!(loading$ | async)" tdLoadingStrategy="overlay">
    <a mat-fab matTooltip="Nuevo prestamo" matTooltipPosition="before" color="accent" class="mat-fab-position-bottom-right z-3"
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
export class PrestamosComponent implements OnInit {
  prestamos$: Observable<FacturistaPrestamo[]>;
  loading$: Observable<boolean>;
  periodo$: Observable<Periodo>;
  search$: Observable<string>;
  facturistas$: Observable<FacturistaDeEmbarque[]>;

  constructor(
    private store: Store<fromStore.State>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.prestamos$ = this.store.pipe(select(fromStore.getAllPrestamos));
    this.loading$ = this.store.pipe(select(fromStore.getEnvioComisionLoading));
    this.search$ = this.store.pipe(select(fromStore.getPrestamosSearch));
    this.facturistas$ = this.store.pipe(select(fromStore.getAllFacturistas));

    this.periodo$ = this.store.pipe(
      select(fromStore.getPrestamosPeriodo),
      tap(periodo => {
        this.reload(periodo);
      })
    );
  }

  onSearch(event: string) {
    this.store.dispatch(new fromStore.SetPrestamosSearchTerm({ term: event }));
  }

  onFilter(event: Periodo) {
    this.store.dispatch(
      new fromStore.SetPrestamosFilter({ filter: { periodo: event } })
    );
  }

  reload(event: Periodo) {
    this.store.dispatch(
      new fromStore.LoadPrestamos({ filter: { periodo: event } })
    );
  }

  onCreate() {
    this.dialog
      .open(PrestamoFormComponent, { data: {}, width: '700px' })
      .afterClosed()
      .subscribe((prestamo: FacturistaPrestamo) => {
        if (prestamo) {
          this.store.dispatch(new fromStore.CreatePrestamo({ prestamo }));
        }
      });
  }

  onEdit(event: FacturistaPrestamo) {
    this.dialog
      .open(PrestamoFormComponent, {
        data: { prestamo: event },
        width: '700px'
      })
      .afterClosed()
      .subscribe((changes: Partial<FacturistaPrestamo>) => {
        if (changes) {
          const update = { id: event.id, changes };
          this.store.dispatch(new fromStore.UpdatePrestamo({ update }));
        }
      });
  }

  onDelete(event: FacturistaPrestamo) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar prestamo',
        message: 'Prestampo: ' + event.id,
        acceptButton: 'ELIMINAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(
            new fromStore.DeletePrestamo({ prestamo: event })
          );
        }
      });
  }
}
