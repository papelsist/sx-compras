import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Periodo } from 'app/_core/models/periodo';
import {
  Clasificacion,
  VentaAcumulada
} from 'app/analisis-de-ventas/models/ventaAcumulada';

@Component({
  selector: 'sx-venta-acumuada-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <form [formGroup]="form" (ngSubmit)="aplicar.emit(form.value)">
    <div layout="column" class="pad">
      <mat-form-field flex>
        <input matInput [matDatepicker]="myDatepicker" placeholder="Fecha inicial" formControlName="fechaInicial"
        autocomplete="off">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker></mat-datepicker>
      </mat-form-field>
      <mat-form-field flex >
        <input matInput [matDatepicker]="myDatepicker2" placeholder="Fecha final" formControlName="fechaFinal"
          autocomplete="off">
        <mat-datepicker-toggle matSuffix [for]="myDatepicker2"></mat-datepicker-toggle>
        <mat-datepicker #myDatepicker2></mat-datepicker>
      </mat-form-field>
      <mat-form-field >
        <mat-select placeholder="Clasificacion" formControlName="clasificacion" class="fill">
          <mat-option *ngFor="let clasificacion of clases"
              [value]="clasificacion">{{ clasificacion }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field >
        <mat-select placeholder="Tipo de venta" formControlName="tipoVenta" >
          <mat-option *ngFor="let tipo of tiposDeVenta"
              [value]="tipo">{{ tipo }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field >
        <mat-select placeholder="Tipo " formControlName="tipo" >
          <mat-option *ngFor="let tipo of tipos"
              [value]="tipo">{{ tipo }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <div layout>
      <button mat-button [disabled]="form.invalid" (click)="aplicar.emit(form.value)">Aplicar</button>
    </div>
  </form>
  `
})
export class VentaAcumuladaFormComponent implements OnInit {
  form: FormGroup;

  @Output()
  aplicar = new EventEmitter<VentaAcumulada>();

  clases = [
    Clasificacion.CLIENTE,
    Clasificacion.LINEA,
    Clasificacion.MES,
    Clasificacion.PRODUCTO,
    Clasificacion.SUCURSAL,
    Clasificacion.VENTA
  ];

  tiposDeVenta = ['TODOS', 'CREDITO', 'CONTADO'];

  tipos = ['TODOS', 'NACIONAL', 'IMPORTADO'];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const periodo = Periodo.ejercicioMes(2017, 11);
    this.form = this.fb.group({
      fechaInicial: [periodo.fechaInicial, [Validators.required]],
      fechaFinal: [periodo.fechaFinal, [Validators.required]],
      clasificacion: [this.clases[0], [Validators.required]],
      tipoVenta: [this.tiposDeVenta[0], [Validators.required]],
      tipo: [this.tipos[0], [Validators.required]]
    });
  }
}
