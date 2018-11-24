import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
  FormControl
} from '@angular/forms';

import { PagoDeMorralla } from '../../models';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Morralla } from 'app/egresos/models/morralla';

@Component({
  selector: 'sx-pago-morralla-form',
  template: `
  <form [formGroup]="form">
    <mat-card>
      <mat-card-title>{{title}}</mat-card-title>
      <mat-divider></mat-divider>
      <mat-card-content>
        <div layout>
          <mat-form-field>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <sx-cuenta-banco-field formControlName="cuentaEgreso" placeholder="Cta Egreso" class="pad-left" flex="25">
          </sx-cuenta-banco-field>
          <sx-cuenta-banco-field formControlName="cuentaIngreso" placeholder="Cta Ingreso" class="pad-left" flex="25">
          </sx-cuenta-banco-field>
          <sx-proveedor-field formControlName="proveedor" placeholder="Proveedor de valores" class="pad-left" flex></sx-proveedor-field>
        </div>

        <div layout>
          <mat-form-field>
            <input matInput formControlName="importe" placeholder="Importe" type="number" autocomplete="off">
          </mat-form-field>

          <mat-form-field  class="pad-left">
            <mat-select placeholder="Forma de pago" formControlName="formaDePago">
              <mat-option *ngFor="let f of ['TRANSFERENCIA']"
                  [value]="f">{{ f }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field class="pad-left">
            <input matInput placeholder="Referencia" formControlName="referencia" autocomplete="off" >
          </mat-form-field>
          <sx-upper-case-field formControlName="comentario" placeholder="Comentario" flex class="pad-left">
          </sx-upper-case-field>
        </div>

      </mat-card-content>
      <sx-morrallas-table [morrallas]="partidas.value">
      </sx-morrallas-table>
      <mat-card-actions>
        <button mat-button type="button" (click)="cancelar.emit()">Canelar</button>
        <button mat-button [disabled]="form.invalid || form.pristine" (click)="submit()" *ngIf="!form.disabled">
          <mat-icon>save</mat-icon> Salvar
        </button>
        <sx-selector-morralla-btn (select)="onAgregarMorralla($event)" *ngIf="!pago"></sx-selector-morralla-btn>
        <button mat-button color="warn" (click)="delete.emit(pago)" *ngIf="pago"><mat-icon >delete</mat-icon> Eliminar</button>
        <ng-content></ng-content>
      </mat-card-actions>
    </mat-card>
  </form>
  `,
  styles: [``]
})
export class PagoMorrallaFormComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input()
  pago: PagoDeMorralla;

  @Output()
  save = new EventEmitter();

  @Output()
  cancelar = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    this.buildForm();
    if (changes.pago && changes.pago.currentValue) {
      // console.log('Editando pago: ', changes.pago.currentValue);
      this.setPago();
      this.form.disable();
    } else {
      this.form.patchValue({
        fecha: new Date(),
        formaDePago: 'TRANSFERENCIA'
      });
    }
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      cuentaEgreso: [null, [Validators.required]],
      cuentaIngreso: [null, [Validators.required]],
      importe: [null, [Validators.required, Validators.min(1)]],
      proveedor: [null, [Validators.required]],
      referencia: [null],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  setPago() {
    this.form.patchValue(this.pago);
    this.cleanPartidas();
    this.pago.partidas.forEach(det => {
      this.partidas.push(new FormControl(det));
    });
  }

  private cleanPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const changes = {
      ...this.form.value,
      fecha: this.form.get('fecha').value.toISOString(),
      cuentaEgreso: this.cuentaEgreso.id,
      cuentaIngreso: this.cuentaIngreso.id
    };
    this.save.emit(changes);
  }

  onAgregarMorralla(selected: Morralla[]) {
    selected.forEach(m => {
      const found = _.find(this.partidas.value, ['id', m.id]);
      if (!found) {
        m.selected = false;
        this.partidas.push(new FormControl(m));
      }
    });
    this.actualizarApagar();
    this.form.markAsDirty();
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get title() {
    if (this.pago) {
      return `Pago de morralla ${this.pago.id} `;
    } else {
      return 'Alta de pago de morralla';
    }
  }

  get cuentaIngreso() {
    return this.form.get('cuentaIngreso').value;
  }

  get cuentaEgreso() {
    return this.form.get('cuentaEgreso').value;
  }

  actualizarApagar() {
    const total = _.sumBy(this.partidas.value, 'importe');
    this.form.get('importe').setValue(Math.abs(total));
  }
}
