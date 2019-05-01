import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sx-envio-comision-form',
  template: `

  <h2 mat-dialog-title>Modificación de comisiones por envio</h2>
  <mat-dialog-content [formGroup]="form">
    <div layout>
      <mat-form-field class="pad-right" flex >
        <input matInput placeholder="Comisión" formControlName="comision" autocomplete="off">
      </mat-form-field>
      <mat-form-field class="pad-right" flex>
        <input matInput placeholder="Precio por Tonelada " formControlName="precioTonelada" autocomplete="off">
      </mat-form-field>
    </div>

    <div layout>
    <mat-form-field class="pad-right" flex >
        <input matInput placeholder="Maniobra" formControlName="maniobra" autocomplete="off" type="number">
      </mat-form-field>
      <mat-form-field class="pad-right" flex>
        <input matInput placeholder="Valor cajas " formControlName="valorCajas" autocomplete="off" type="number">
      </mat-form-field>
    </div>

    <div layout>
      <sx-upper-case-field class="pad-right" flex placeholder="Comentario" formControlName="comentarioDeComision" autocomplete="off">
      </sx-upper-case-field>

    </div>
  </mat-dialog-content>

  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Canelar</button>
    <button mat-button (click)="onSubmit()">Aceptar</button>
  </mat-dialog-actions>
`
})
export class EnvioComisionFormComponent implements OnInit {
  form: FormGroup;
  comisionBase: {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EnvioComisionFormComponent>,
    fb: FormBuilder
  ) {
    this.comisionBase = data.comisionBase;
    this.form = fb.group({
      comision: [null, [Validators.required]],
      precioTonelada: [null, []],
      valorCajas: [0.0],
      maniobra: [0.0],
      comentarioDeComision: [null, []]
    });

    this.form.patchValue(this.comisionBase);
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const data = {
        ...this.form.value
      };
      this.dialogRef.close(data);
    }
  }
}
