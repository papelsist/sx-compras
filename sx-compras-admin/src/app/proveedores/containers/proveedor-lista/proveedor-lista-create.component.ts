import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';
import * as fromActions from '../../store/actions/listasDePrecios.actions';

import { Observable } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

import { Proveedor } from '../../models/proveedor';
import { ProveedorProducto } from '../../models/proveedorProducto';
import { ListaDePreciosProveedor } from '../../models/listaDePreciosProveedor';

import { Periodo } from 'app/_core/models/periodo';

@Component({
  selector: 'sx-proveedor-lista-create',
  template: `
    <div *ngIf="proveedor$ | async as proveedor">
      <sx-proveedor-lista-form [listaDePrecios]="listaNueva$ | async" (save)="onSave($event)"
        [productos]="productos$ | async"></sx-proveedor-lista-form>
    </div>
  `
})
export class ProveedorListaCreateComponent implements OnInit {
  proveedor$: Observable<Proveedor>;
  productos$: Observable<ProveedorProducto[]>;
  listaNueva$: Observable<Partial<ListaDePreciosProveedor>>;
  constructor(private store: Store<fromStore.ProveedoresState>) {}

  ngOnInit() {
    this.proveedor$ = this.store.pipe(select(fromStore.getCurrentProveedor));
    this.productos$ = this.store.pipe(
      select(fromStore.getAllProveedorProductos)
    );
    this.listaNueva$ = this.proveedor$.pipe(
      map(proveedor => this.buildLista(proveedor))
    );
  }

  onSave(event: ListaDePreciosProveedor) {
    console.log('Salvando lista de precios: ', event);
    this.store.dispatch(new fromActions.AddListaDePreciosProveedor(event));
  }

  buildLista(proveedor: Proveedor): Partial<ListaDePreciosProveedor> {
    console.log('Build para: ', proveedor);
    const periodo = Periodo.mesActual();
    return {
      proveedor: proveedor,
      ejercicio: periodo.fechaFinal.getFullYear(),
      mes: periodo.fechaInicial.getMonth(),
      fechaInicial: periodo.fechaInicial.toISOString(),
      fechaFinal: periodo.fechaFinal.toISOString(),
      partidas: []
    };
  }
}
