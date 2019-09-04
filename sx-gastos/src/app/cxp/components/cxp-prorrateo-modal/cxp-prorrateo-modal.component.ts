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
    tacuba: '12',
    febrero: '13',
    vertiz: '2',
    solis: '14'
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
        febrero: [null, { updateOn: 'blur' }],
        vertiz: [null, { updateOn: 'blur' }],
        solis: [null, { updateOn: 'blur' }]
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

  getSucursalValue(key: string): { key: string; value: boolean } {
    const value: boolean = this.form.get(key).value;
    if (value) {
      return { key: this.sucursales[key], value };
    }
    return null;
  }
}
