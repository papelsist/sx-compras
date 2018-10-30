import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subscription } from 'rxjs';

import { Cliente } from 'app/models';
import { ConfigService } from 'app/utils/config.service';
import {
  switchMap,
  skip,
  tap,
  debounceTime,
  distinctUntilChanged,
  filter
} from 'rxjs/operators';

import * as _ from 'lodash';

export const CLIENTE_LOOKUPFIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ClienteFieldComponent),
  multi: true
};

@Component({
  selector: 'sx-cliente-field',
  providers: [CLIENTE_LOOKUPFIELD_VALUE_ACCESSOR],
  template: `
  <mat-form-field  class="fill">
    <input type="text" matInput [formControl]="searchControl"
        [placeholder]="placeholder" #inputField
        [required]="required"
        [matAutocomplete]="auto"
        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
    <mat-icon matSuffix>search</mat-icon>
    <mat-error>
      Seleccione un cliente
    </mat-error>
  </mat-form-field>
  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" >
    <mat-option *ngFor="let cliente of clientes$ | async " [value]="cliente"
      [ngClass]="{'tc-red-800': !cliente.activo}">
        {{cliente.nombre}} ({{cliente.rfc}}) - {{cliente.credito ? 'Credito': 'Contado' }}
    </mat-option>
  </mat-autocomplete>
  `,
  styles: [
    `
      .fill {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteFieldComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  apiUrl: string;

  searchControl = new FormControl();

  @Input()
  required = false;

  @Input()
  activos = false;

  @Input()
  tipo = 'TODOS';

  @Input()
  placeholder = 'Cliente';

  clientes$: Observable<Cliente[]>;

  onChange;
  onTouch;

  @ViewChild('inputField')
  inputField: ElementRef;

  subscription: Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('clientes');
  }

  ngOnInit() {
    this.clientes$ = this.searchControl.valueChanges.pipe(
      switchMap(term => this.lookUp(term))
    );
    this.prepareControl();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private prepareControl() {
    this.subscription = this.searchControl.valueChanges
      .pipe(
        skip(1),
        debounceTime(500),
        distinctUntilChanged(),
        filter(value => _.isObject(value)),
        distinctUntilChanged((p: Cliente, q: Cliente) => p.id === q.id)
      )
      .subscribe(val => {
        this.onChange(val);
      });
  }

  lookUp(value: string): Observable<Cliente[]> {
    const params = new HttpParams()
      .set('term', value)
      .set('tipo', this.tipo)
      .set('activos', this.activos ? 'true' : 'false');
    return this.http.get<Cliente[]>(this.apiUrl, {
      params: params
    });
  }

  displayFn(cliente: Cliente) {
    return cliente
      ? `${cliente.nombre} (${cliente.rfc}) [${
          cliente.credito ? 'Crédito' : 'Contado'
        }]`
      : '';
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

  compareFn(c1: Cliente, c2: Cliente): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
