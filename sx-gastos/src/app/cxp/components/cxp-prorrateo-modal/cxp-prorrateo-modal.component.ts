import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

import { GastoDet } from 'app/cxp/model';

@Component({
  selector: 'sx-cxp-prorrateo-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-prorrateo-modal.component.html'
})
export class CxpProrrateoModalComponent implements OnInit {
  form: FormGroup;
  gastoDet: Partial<GastoDet>;

  sucursales = {
    oficinas: '1',
    andrade: '3',
    bolivar: '5',
    calle4: '10',
    tacuba: '2',
    febrero: '13'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CxpProrrateoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gastoDet = data.gastoDet;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group(
      {
        oficinas: new FormControl(null, { updateOn: 'blur' }),
        andrade: [null, { updateOn: 'blur' }],
        calle4: [null, { updateOn: 'blur' }],
        bolivar: [null, { updateOn: 'blur' }],
        tacuba: [null, { updateOn: 'blur' }],
        febrero: [null, { updateOn: 'blur' }]
      },
      { validator: [this.validateImporte.bind(this)] }
    );
  }

  close() {
    this.dialogRef.close();
  }

  doAccept() {
    if (this.form.valid) {
      const res = {
        oficinas: this.getSucursalValue('oficinas'),
        andrade: this.getSucursalValue('andrade'),
        calle4: this.getSucursalValue('calle4'),
        bolivar: this.getSucursalValue('bolivar'),
        tacuba: this.getSucursalValue('tacuba'),
        febrero: this.getSucursalValue('febrero')
      };
      this.dialogRef.close(res);
    }
  }

  get importe() {
    return this.gastoDet.importe;
  }

  get faltante(): number {
    const val = _.values(this.form.value).reduce((prev, curr) => prev + curr);
    return this.importe - val;
  }

  getSucursalValue(key: string): { key: string; value: number } {
    const value: number = this.form.get(key).value;
    if (value > 0.0) {
      return { key: this.sucursales[key], value };
    }
    return null;
  }

  validateImporte(fg: FormGroup) {
    const val = _.values(fg.value).reduce((prev, curr) => prev + curr);
    const dif = this.importe - val;
    return dif === 0.0 ? null : { importeImcompleto: true };
  }
}
