import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  forwardRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { of as observableOf, Observable, Subscription } from 'rxjs';
import { map, switchMap, startWith, skip, filter } from 'rxjs/operators';

import * as _ from 'lodash';

import { Proveedor } from 'app/proveedores/models/proveedor';
import { ConfigService } from 'app/utils/config.service';

export const PRODUCTO_PROV_LOOKUPFIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProductoProvFieldComponent),
  multi: true
};

@Component({
  selector: 'sx-producto-prov-field',
  providers: [PRODUCTO_PROV_LOOKUPFIELD_VALUE_ACCESSOR],
  templateUrl: './producto-prov-field.component.html',
  styles: [
    `
      .fill {
        width: 100%;
      }
    `
  ]
})
export class ProductoProvFieldComponent
  implements OnInit, ControlValueAccessor, OnDestroy, OnChanges {
  private apiUrl: string;

  searchControl = new FormControl();

  @Input() proveedor: Proveedor;

  @Input() required = false;

  @Input() activos = true;

  @Input() placeholder = 'Seleccione un producto';

  @Input() excludes: Array<string> = [];

  productos$: Observable<Array<any>>;

  onChange;
  onTouch;
  subscription: Subscription;

  @ViewChild('inputField') inputField: ElementRef;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('proveedores');
  }

  ngOnInit() {
    this.productos$ = this.searchControl.valueChanges.pipe(
      startWith(null),
      switchMap(term => this.lookupProductos(term)),
      map(prods => {
        const filtrados = _.differenceWith(
          prods,
          this.excludes,
          (val1, val2) => {
            return val1.producto.clave === val2;
          }
        );
        return filtrados;
      })
    );
    this.prepareControl();
  }

  private prepareControl() {
    this.subscription = this.searchControl.valueChanges
      .pipe(skip(1), filter(value => value !== null))
      .subscribe(value => {
        if (_.isObject(value)) {
          this.onChange(value);
        } else {
          this.onChange(null);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes): void {}

  lookupProductos(term: string): Observable<Array<any>> {
    if (this.proveedor == null) {
      return observableOf([]);
    }
    let params = new HttpParams().set('term', term);
    if (this.activos === true) {
      params = params.set('activos', 'activos');
    }
    const url = `${this.apiUrl}/${this.proveedor.id}/productos`;
    return this.http.get<Array<any>>(url, { params: params });
  }

  displayFn(provProd) {
    return provProd ? `(${provProd.clave}) ${provProd.descripcion}` : '';
  }

  writeValue(obj: any): void {
    this.searchControl.setValue(obj);
    if (obj === null) {
      this.searchControl.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  focus() {
    this.inputField.nativeElement.focus();
  }

  onBlur() {
    if (this.onTouch) {
      this.onTouch();
    }
  }
}
