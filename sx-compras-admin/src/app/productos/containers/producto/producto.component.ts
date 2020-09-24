import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from 'app/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Producto } from '../../models/producto';
import { Linea } from '../../models/linea';
import { Marca } from '../../models/marca';
import { Clase } from '../../models/clase';
import { TdDialogService } from '@covalent/core';
import { GrupoDeProducto } from 'app/productos/models/grupo';

@Component({
  selector: 'sx-producto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template
      tdLoading
      [tdLoadingUntil]="!(saving$ | async)"
      tdLoadingStrategy="overlay"
    >
      <sx-producto-form
        [producto]="producto$ | async"
        [lineas]="lineas$ | async"
        [marcas]="marcas$ | async"
        [clases]="clases$ | async"
        [grupos]="grupos$ | async"
        (save)="onSave($event)"
        (delete)="onDelete($event)"
        (cancel)="onCancel()"
      >
      </sx-producto-form>
    </ng-template>
  `,
  styles: []
})
export class ProductoComponent implements OnInit {
  producto$: Observable<Producto>;
  lineas$: Observable<Linea[]>;
  marcas$: Observable<Marca[]>;
  clases$: Observable<Clase[]>;
  grupos$: Observable<GrupoDeProducto[]>;
  saving$: Observable<boolean>;

  constructor(
    private store: Store<fromStore.CatalogosState>,
    private dialogservice: TdDialogService
  ) {}

  ngOnInit() {
    this.saving$ = this.store.select(fromStore.getProductosLoading);
    this.producto$ = this.store.select(fromStore.getSelectedProducto);
    this.lineas$ = this.store.select(fromStore.getAllLineas);
    this.marcas$ = this.store.select(fromStore.getAllMarcas);
    this.clases$ = this.store.select(fromStore.getAllClases);
    this.grupos$ = this.store.select(fromStore.getAllGrupos);
  }

  onSave(producto: Producto) {
    if (!producto.id) {
      this.store.dispatch(new fromStore.CreateProducto(producto));
    } else {
      this.store.dispatch(new fromStore.UpdateProducto(producto));
    }
  }

  onDelete(event: Producto) {
    this.dialogservice
      .openConfirm({
        title: 'Manteniento de producto',
        message: `Eliminar el producto ${event.clave} ?`,
        acceptButton: 'Elimiar',
        cancelButton: 'Cancelar'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.store.dispatch(new fromStore.RemoveProducto(event));
        }
      });
  }
  onCancel() {
    this.store.dispatch(new fromRoot.Back());
  }
}
