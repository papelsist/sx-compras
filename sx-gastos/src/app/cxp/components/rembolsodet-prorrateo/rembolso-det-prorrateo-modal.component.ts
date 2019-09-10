import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

import { RembolsoDet } from 'app/cxp/model';

@Component({
  selector: 'sx-rembolsodet-prorrateo-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rembolso-det-prorrateo-modal.component.html'
})
export class RembolsoDetProrrateoModalComponent implements OnInit {
  form: FormGroup;
  rembolsoDet: Partial<RembolsoDet>;

  sucursales = {
    oficinas: 'OFICINAS',
    andrade: 'ANDRADE',
    bolivar: 'BOLIVAR',
    calle4: 'CALLE 4',
    tacuba: 'TACUBA',
    febrero: 'CF5FEBRERO',
    vertiz: 'VERTIZ 176',
    solis: 'SOLIS',
    ventas: 'VENTAS'
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RembolsoDetProrrateoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rembolsoDet = data.rembolsoDet;
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
        febrero: [null, { updateOn: 'blur' }],
        vertiz: [null, { updateOn: 'blur' }],
        solis: [null, { updateOn: 'blur' }],
        ventas: [null, { updateOn: 'blur' }]
      }
      // { validator: [this.validateImporte.bind(this)] }
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
        febrero: this.getSucursalValue('febrero'),
        vertiz: this.getSucursalValue('vertiz'),
        solis: this.getSucursalValue('solis')
      };
      this.dialogRef.close(res);
    }
  }

  getSucursalValue(key: string): { nombre: string; value: boolean } {
    const value: boolean = this.form.get(key).value;
    if (value) {
      return { nombre: this.sucursales[key], value };
    }
    return null;
  }
}
