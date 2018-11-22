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

import { DevolucionCliente } from '../../models';

import { switchMap } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'sx-devolucion-form',
  template: `
  <form [formGroup]="form">
    <mat-card >
      <mat-card-title>{{title}}</mat-card-title>
      <mat-divider></mat-divider>
      <mat-card-content layout>
        <div layout>
          <mat-form-field>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <sx-cuenta-banco-field formControlName="cuenta" placeholder="Cta Egreso" class="pad-left" flex>
          </sx-cuenta-banco-field>
        </div>

        <div layout>

          <mat-form-field   flex>
            <mat-select placeholder="Forma de pago" formControlName="formaDePago">
              <mat-option *ngFor="let f of ['CHEQUE', 'TRANSFERENCIA']"
                  [value]="f">{{ f }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field class="pad-left" flex>
            <input matInput placeholder="Referencia" formControlName="referencia" autocomplete="off" >
          </mat-form-field>
        </div>
        <sx-cliente-field formControlName="cliente"></sx-cliente-field>
        <sx-upper-case-field formControlName="comentario" placeholder="Comentario" flex >
        </sx-upper-case-field>

      </mat-card-content>

      <mat-card-actions>
        <button mat-button type="button" (click)="cancelar.emit()">Canelar</button>
        <button mat-button [disabled]="form.invalid || form.pristine" (click)="submit()" *ngIf="!form.disabled">
          <mat-icon>save</mat-icon> Salvar
        </button>
        <sx-selector-cobros-btn></sx-selector-cobros-btn>
        <button mat-button color="warn" (click)="delete.emit(devolucion)" *ngIf="devolucion"><mat-icon >delete</mat-icon> Eliminar</button>
        <ng-content></ng-content>
      </mat-card-actions>
    </mat-card>
  </form>
  `,
  styles: [``]
})
export class DevolucionFormComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input()
  devolucion: DevolucionCliente;

  @Output()
  save = new EventEmitter();

  @Output()
  cancelar = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    this.buildForm();
    this.clienteListener();
    if (this.devolucion) {
      console.log('Editando devolucion: ', this.devolucion);
      this.form.patchValue(this.devolucion);
      this.form.disable();
    } else {
      this.form.patchValue({
        fecha: new Date(),
        formaDePago: 'CHEQUE'
      });
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      cuenta: [null, [Validators.required]],
      cliente: [null, [Validators.required]],
      importe: [null, [Validators.required, Validators.min(1)]],
      proveedor: [null, [Validators.required]],
      referencia: [null],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  clienteListener() {
    if (!this.devolucion) {
      const ref$ = this.form.get('cliente').valueChanges.pipe(
        switchMap(value => {
          return 'Cobros detectados : ' + value;
        })
      );
      ref$.subscribe(val => console.log(val));
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const changes = {
      ...this.form.value,
      fecha: this.form.get('fecha').value.toISOString(),
      cuenta: this.form.get('cuenta').value.cuenta.id
    };
    this.save.emit(changes);
  }

  get title() {
    if (this.devolucion) {
      return `Devolución a cliente ${this.devolucion.id} `;
    } else {
      return 'Alta de devolucion a cliente';
    }
  }
}
