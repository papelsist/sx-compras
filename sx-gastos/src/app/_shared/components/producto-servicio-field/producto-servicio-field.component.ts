import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import * as _ from 'lodash';

import { Observable, Subscription } from 'rxjs';
import {
  skip,
  switchMap,
  tap,
  debounceTime,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';

export const PRODUCTO_SERVICIO_LOOKUPFIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => ProductoServicioFieldComponent),
  multi: true
};

@Component({
  selector: 'sx-producto-servicio-field',
  providers: [PRODUCTO_SERVICIO_LOOKUPFIELD_VALUE_ACCESSOR],
  template: `
    <mat-form-field class="fill">
    <input type="text" matInput [formControl]="searchControl" placeholder="Producto " [required]="required" [matAutocomplete]="auto">
    <mat-error>
      Debe selccionar un producto / servicio
    </mat-error>
  </mat-form-field>

  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
    <mat-option *ngFor="let producto of productos$ | async" [value]="producto">
     {{producto.descripcion}} -- {{producto.clasificacion}} ({{producto?.cuentaContable?.clave}})
    </mat-option>
  </mat-autocomplete>
  `,
  styles: [
    `
      .fill {
        width: 100%;
      }
    `
  ]
})
export class ProductoServicioFieldComponent
  implements OnInit, ControlValueAccessor {
  private apiUrl: string;

  searchControl = new FormControl();

  @Input()
  required = false;
  @Input()
  activos = true;

  productos$: Observable<any[]>;

  onChange;
  onTouch;
  subscription: Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('productoServicio');
  }

  ngOnInit() {
    this.productos$ = this.searchControl.valueChanges.pipe(
      switchMap(term => this.lookupProductoes(term))
    );
    this.prepareControl();
  }

  private prepareControl() {
    this.subscription = this.searchControl.valueChanges
      .pipe(
        skip(1),
        tap(() => this.onTouch()),
        debounceTime(500),
        distinctUntilChanged(),
        filter(value => _.isObject(value)),
        distinctUntilChanged((p: any, q: any) => p.id === q.id)
      )
      .subscribe(val => {
        this.onChange(val);
      });
  }

  lookupProductoes(value: string): Observable<any[]> {
    const params = new HttpParams().set('term', value);
    return this.http.get<any[]>(this.apiUrl, {
      params: params
    });
  }

  displayFn(producto: any) {
    if (!producto) {
      return '';
    }
    return `${producto.descripcion} -- ${producto.clasificacion} (${producto.cuentaContable.clave})`;
  }

  writeValue(obj: any): void {
    this.searchControl.setValue(obj);
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
}
