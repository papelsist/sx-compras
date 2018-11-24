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

import { Observable, Subject } from 'rxjs';
import { switchMap, filter, tap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import { DevolucionClienteService } from 'app/egresos/services';
import { Cobro } from 'app/ingresos/models';

@Component({
  selector: 'sx-devolucion-form',
  template: `
  <form [formGroup]="form">
    <mat-card >
      <mat-card-title>{{title}}</mat-card-title>
      <mat-divider></mat-divider>
      <mat-card-content layout>
        <sx-cliente-field formControlName="cliente"></sx-cliente-field>
        <sx-upper-case-field formControlName="afavor" placeholder="A favor" >
        </sx-upper-case-field>
        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Fecha del cobro" disabled="true" [value]="cobro?.fecha | date: 'dd/MM/yyyy'">
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Importe del cobro" disabled="true" [value]="cobro?.importe | currency">
          </mat-form-field>
          <mat-form-field flex class="pad-left">
            <input matInput placeholder="Saldo" disabled="true" [value]="cobro?.saldo | currency">
          </mat-form-field>
        </div>

        <div layout>
          <mat-form-field>
            <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha" formControlName="fecha" autocomplete="off">
            <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
            <mat-datepicker #myDatepicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field  class="pad-left"  flex>
            <mat-select placeholder="Concepto" formControlName="concepto">
              <mat-option *ngFor="let f of ['DEPOSITO_DEVUELTO',
              'DEPOSITO_POR_IDENTIFICAR',
              'NOTA_CON',
              'NOTA_COD',
              'NOTA_CRE',
              'SALDO_A_FAVOR']"
                  [value]="f">{{ f }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <sx-cuenta-banco-field formControlName="cuenta" placeholder="Cuenta" class="pad-left" tipo="CHEQUES" flex>
          </sx-cuenta-banco-field>
        </div>

        <div layout>
          <mat-form-field flex>
            <input matInput placeholder="Importe" formControlName="importe" autocomplete="off" >
          </mat-form-field>
          <mat-form-field  class="pad-left"  flex>
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

        <sx-upper-case-field formControlName="comentario" placeholder="Comentario" flex >
        </sx-upper-case-field>

        <mat-slide-toggle [checked]="false" (change)="manual($event)" *ngIf="form.get('formaDePago').value === 'CHEQUE'">
            Asignación manual de cheque
          </mat-slide-toggle>

      </mat-card-content>

      <mat-card-actions>
        <button mat-button type="button" (click)="cancelar.emit()">Devoluciones</button>
        <button mat-button [disabled]="form.invalid || form.pristine" (click)="submit()" *ngIf="!form.disabled" color="primary">
          <mat-icon>save</mat-icon> Pagar
        </button>
        <sx-selector-cobros-btn [cobros]="cobros$ | async " [cliente]="cliente" (select)="asignarCobro($event)" *ngIf="!devolucion">
        </sx-selector-cobros-btn>
        <button mat-button color="warn" (click)="delete.emit(devolucion)" *ngIf="devolucion"><mat-icon >delete</mat-icon> Eliminar</button>
        <ng-content></ng-content>
      </mat-card-actions>
    </mat-card>

  </form>

  `,
  styles: [
    `
      .cobro-panel2 {
        // border: 0.5px black solid;
        legend {
          border-top: 0.5px black solid;
          margin-left: 1em;
          // padding: 0.2em 0.8em;
        }
      }
    `
  ]
})
export class DevolucionFormComponent implements OnInit, OnChanges, OnDestroy {
  form: FormGroup;
  @Input()
  devolucion: DevolucionCliente;

  @Output()
  save = new EventEmitter();

  @Output()
  cancelar = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  cobros$: Observable<Cobro[]>;

  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private service: DevolucionClienteService
  ) {}

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {
    this.buildForm();
    this.clienteListener();
    this.formaDePagoListener();
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm() {
    this.form = this.fb.group({
      fecha: [null, [Validators.required]],
      formaDePago: [null, [Validators.required]],
      cuenta: [null, [Validators.required]],
      afavor: [null],
      cliente: [null, [Validators.required]],
      cobro: [null, [Validators.required]],
      concepto: [null, [Validators.required]],
      importe: [null, [Validators.required, Validators.min(0.01)]],
      referencia: [null],
      comentario: []
    });
  }

  clienteListener() {
    if (!this.devolucion) {
      this.cobros$ = this.form.get('cliente').valueChanges.pipe(
        filter(value => _.isObject(value)),
        tap(value => this.form.get('afavor').setValue(value.nombre)),
        switchMap(value => {
          return this.service.cobros(value.id);
        })
      );
    }
  }

  formaDePagoListener() {
    this.form
      .get('cuenta')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(cta => {
        if (this.form.get('formaDePago').value === 'CHEQUE') {
          this.form.get('referencia').setValue(cta.proximoCheque);
          this.form.get('referencia').disable();
        } else {
          this.form.get('referencia').setValue('');
          this.form.get('referencia').enable();
        }
      });
  }

  asignarCobro(cobros: Cobro[]) {
    const cobro = cobros[0];
    this.form.get('cobro').setValue(cobro);
    this.form.get('importe').setValue(cobro.saldo);
    this.form.markAsDirty();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const changes = {
      ...this.form.value,
      cliente: this.form.get('cliente').value.id,
      fecha: this.form.get('fecha').value.toISOString(),
      cuenta: this.form.get('cuenta').value.id,
      cobro: this.cobro.id,
      referencia: this.form.get('referencia').value,
      afavor: this.form.get('cliente').value.nombre
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

  get cliente() {
    return this.form.get('cliente').value;
  }
  get cobro() {
    return this.form.get('cobro').value;
  }

  manual(event) {
    if (event.checked) {
      this.form.get('referencia').enable();
    } else {
      this.form.get('referencia').disable();
    }
  }
}
