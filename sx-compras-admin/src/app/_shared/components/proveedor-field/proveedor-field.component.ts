import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import * as _ from 'lodash';

import { Proveedor } from '../../../models/proveedor';
import { ConfigService } from '../../../utils/config.service';

export const PROVEEDOR_LOOKUPFIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProveedorFieldComponent),
  multi: true
};

@Component({
  selector: 'sx-proveedor-field',
  providers: [PROVEEDOR_LOOKUPFIELD_VALUE_ACCESSOR],
  templateUrl: './proveedor-field.component.html',
  styleUrls: ['./proveedor-field.component.scss']
})
export class ProveedorFieldComponent implements OnInit, ControlValueAccessor {
  private apiUrl: string;

  searchControl = new FormControl();

  @Input() required = false;

  proveedores$: Observable<Proveedor[]>;

  onChange;
  onTouch;
  subscription: Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('proveedores');
  }

  ngOnInit() {
    this.proveedores$ = this.searchControl.valueChanges.switchMap(term =>
      this.lookupProveedores(term)
    );

    this.prepareControl();
  }

  private prepareControl() {
    this.subscription = this.searchControl.valueChanges
      .skip(1)
      .do(() => this.onTouch())
      .debounceTime(500)
      .distinctUntilChanged()
      .filter(value => _.isObject(value))
      .distinctUntilChanged((p: Proveedor, q: Proveedor) => p.id === q.id)
      .subscribe(val => {
        this.onChange(val);
      });
  }

  lookupProveedores(value: string): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl, {
      params: new HttpParams().set('term', value)
    });
  }

  displayFn(proveedor: Proveedor) {
    return proveedor ? proveedor.nombre : proveedor;
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
