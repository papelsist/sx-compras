import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { TdDialogService } from '@covalent/core';

import { Observable } from 'rxjs';
import { GrupoDeProducto } from '../../models/grupo';

import { Store } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromGrupos from '../../store/actions/grupos.actions';
import { GrupoFormComponent } from 'app/productos/components';

@Component({
  selector: 'sx-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss']
})
export class GruposComponent implements OnInit {
  grupos$: Observable<GrupoDeProducto[]>;

  constructor(
    private store: Store<fromStore.CatalogosState>,
    private dialog: MatDialog,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.grupos$ = this.store.select(fromStore.getAllGrupos);
  }

  onCreate() {
    this.onEdit(null);
  }

  onEdit(grupo: Partial<GrupoDeProducto>) {
    const dialogRef = this.dialog
      .open(GrupoFormComponent, {
        data: {
          grupo: grupo
        },
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          const target = { ...grupo, ...res };
          if (target.id) {
            this.store.dispatch(new fromGrupos.UpdateGrupo(target));
          } else {
            this.store.dispatch(new fromGrupos.CreateGrupo(target));
          }
        }
      });
  }

  onDelete(grupo: GrupoDeProducto) {
    this.dialogService
      .openConfirm({
        title: 'Eliminación de Grupo',
        message: `${grupo.nombre}`,
        acceptButton: 'Eliminar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromGrupos.RemoveGrupo(grupo));
        }
      });
  }
}
