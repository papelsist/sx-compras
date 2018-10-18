import {
  Component,
  Input,
  OnInit,
  forwardRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subscription } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';

import { ConfigService } from 'app/utils/config.service';
import { BancoSat } from 'app/models';

import * as _ from 'lodash';

export const BANCO_SAT_LOOKUPFIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BancoSatFieldComponent),
  multi: true
};

@Component({
  selector: 'sx-banco-sat-field',
  providers: [BANCO_SAT_LOOKUPFIELD_VALUE_ACCESSOR],
  template: `
  <mat-form-field class="fill">
    <input type="text" matInput [formControl]="searchControl" (blur)="onBlur()" [placeholder]="placeholder" #inputField
      [required]="required" [matAutocomplete]="auto" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
    <mat-icon matSuffix>account_balance_wallet</mat-icon>
    <mat-error>
      Seleccione un banco
    </mat-error>
  </mat-form-field>
  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn" (optionSelected)="select($event)">
    <mat-option *ngFor="let banco of filtered$ | async" [value]="banco">
    {{(banco.clave)}} - {{banco.nombreCorto}}
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
export class BancoSatFieldComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  apiUrl: string;

  searchControl = new FormControl();

  @Input()
  required = false;

  @Input()
  placeholder = 'Banco SAT';

  bancos$: Observable<BancoSat[]>;

  filtered$: Observable<BancoSat[]>;

  bancos: BancoSat[] = [];

  onChange;

  onTouch;

  @ViewChild('inputField')
  inputField: ElementRef;

  subscription: Subscription;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.apiUrl = config.buildApiUrl('sat/bancos');
  }

  ngOnInit() {
    const params = new HttpParams()
      .set('max', '500')
      .set('sort', 'nombreCorto');
    this.subscription = this.http
      .get<any>(this.apiUrl, { params: params })
      .subscribe(res => (this.bancos = res));

    this.filtered$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      filter(value => typeof value === 'string'),
      map(value => this._filter(value))
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  select(event) {
    this.onChange(event.option.value);
  }

  displayFn(banco: any) {
    return banco ? `(${banco.clave}) ${banco.razonSocial}` : '';
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

  private _filter(value: string): BancoSat[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.bancos.filter(option =>
        option.nombreCorto.toLowerCase().includes(filterValue)
      );
    }
  }
}
