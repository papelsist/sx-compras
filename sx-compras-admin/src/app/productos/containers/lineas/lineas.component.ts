import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';

import { Observable } from 'rxjs';
import { LineasService } from '../../services';
import { Linea } from '../../models/linea';
import { LineaFormComponent } from '../../components';

import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromLineas from '../../store/actions/lineas.actions';

@Component({
  selector: 'sx-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})
export class LineasComponent implements OnInit {
  lineas$: Observable<Linea[]>;

  constructor(
    private store: Store<fromStore.CatalogosState>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.lineas$ = this.store.select(fromStore.getAllLineas);
    // this.store.dispatch(new fromLineas.LoadLineas());
  }

  onCreate() {
    this.onEdit(null);
  }

  onEdit(linea: Partial<Linea>) {
    const dialogRef = this.dialog
      .open(LineaFormComponent, {
        data: {
          linea: linea
        },
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const target = { ...linea, ...res };
          if (target.id) {
            this.store.dispatch(new fromLineas.UpdateLinea(target));
          } else {
            this.store.dispatch(new fromLineas.CreateLinea(target));
          }
        }
      });
  }

  onDelete(linea: Linea) {
    this.dialogService
      .openConfirm({
        title: 'Eliminación de línea',
        message: `${linea.linea}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromLineas.RemoveLinea(linea));
        }
      });
  }
}
