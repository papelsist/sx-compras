import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';

import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromMarcas from '../../store/actions/marcas.actions';

import { Observable } from 'rxjs';

import { Marca } from '../../models/marca';
import { MarcaFormComponent } from '../../components';

@Component({
  selector: 'sx-marcas',
  templateUrl: './marcas.component.html',
  styles: []
})
export class MarcasComponent implements OnInit {
  marcas$: Observable<Marca[]>;

  constructor(
    private store: Store<fromStore.CatalogosState>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.marcas$ = this.store.select(fromStore.getAllMarcas);
  }

  onCreate() {
    this.onEdit({});
  }

  onEdit(event: Partial<Marca>) {
    this.dialog
      .open(MarcaFormComponent, {
        data: { marca: event },
        width: '550px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const target = {
            ...event,
            ...res
          };
          if (target.id) {
            this.store.dispatch(new fromMarcas.UpdateMarca(target));
          } else {
            this.store.dispatch(new fromMarcas.CreateMarca(target));
          }
        }
      });
  }

  onDelete(event: Marca) {
    this.dialogService
      .openConfirm({
        title: 'Eliminar marca',
        message: event.marca,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromMarcas.RemoveMarca(event));
        }
      });
  }
}
