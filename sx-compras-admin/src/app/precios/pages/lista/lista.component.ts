import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { ListaDePreciosVenta } from '../../models';
import { Update } from '@ngrx/entity';
import { TdDialogService } from '@covalent/core';

@Component({
  selector: 'sx-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss']
})
export class ListaComponent implements OnInit {
  loading$: Observable<boolean>;
  disponibles$: Observable<any[]>;
  lista$: Observable<ListaDePreciosVenta>;

  constructor(
    private store: Store<fromStore.State>,
    private dialogService: TdDialogService
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.selectListasLoading));
    this.disponibles$ = this.store.pipe(select(fromStore.selectDisponibles));
    this.lista$ = this.store.pipe(select(fromStore.getCurrentLista));
  }

  onBack() {
    this.store.dispatch(new fromRoot.Back());
  }

  onUpdate(lista: Update<ListaDePreciosVenta>) {
    this.store.dispatch(new fromStore.UpdateLista({ update: lista }));
  }

  doAplicar(lista: Partial<ListaDePreciosVenta>) {
    this.dialogService
      .openConfirm({
        title: 'APLICACION DE LISTA DE PRECIOS',
        message: `LISTA : ${lista.id} ${lista.descripcion}`,
        cancelButton: 'CANCELAR',
        acceptButton: 'APLICAR',
        width: '650px'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.AplicarListaDePrecios({ lista }));
        }
      });
  }

  onDelete(lista: Partial<ListaDePreciosVenta>) {
    this.dialogService.openConfirm({
      title: 'ELIMINAR LISTA',
      message: `FOLIO: ${lista.id}`,
      acceptButton: 'ELIMINAR',
      cancelButton: 'CANCELAR'
    }).afterClosed().subscribe( res => {
      if (res) {
        this.store.dispatch(new fromStore.DeleteLista({lista}));
      }
    });
  }
}
