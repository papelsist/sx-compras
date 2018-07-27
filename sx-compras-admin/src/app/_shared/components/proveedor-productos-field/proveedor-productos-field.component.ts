import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { ProveedorProducto } from 'app/proveedores/models/proveedorProducto';

@Component({
  selector: 'sx-proveedor-producto-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-productos-field.component.html'
})
export class ProveedorProductoFieldComponent implements OnInit, OnDestroy {
  @Input() parent: FormGroup;
  @Input() propertyName = 'producto';
  @Input() productos: ProveedorProducto[] = [];
  filteredProducts$: Observable<ProveedorProducto[]>;
  constructor() {}

  ngOnInit() {
    this.filteredProducts$ = this.parent
      .get(this.propertyName)
      .valueChanges.pipe(
        startWith<string | ProveedorProducto>(''),
        map(value => (typeof value === 'string' ? value : value.clave)),
        map(name => (name ? this._filter(name) : this.productos.slice()))
      );
  }

  ngOnDestroy() {}

  displayFn(provProd: ProveedorProducto) {
    return provProd ? `(${provProd.clave}) ${provProd.descripcion}` : '';
  }

  private _filter(value: string): ProveedorProducto[] {
    const filterValue = value.toLowerCase();
    return this.productos.filter(item => {
      return (
        item.clave.toLowerCase().indexOf(filterValue) !== -1 ||
        item.descripcion.toLowerCase().indexOf(filterValue) !== -1
      );
    });
  }
}
