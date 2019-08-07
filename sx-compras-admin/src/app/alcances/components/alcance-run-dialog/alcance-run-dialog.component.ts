import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators
} from '@angular/forms';

import * as _ from 'lodash';
import { Periodo } from '../../../_core/models/periodo';

@Component({
  selector: 'sx-alcance-run-dialog',
  templateUrl: './alcance-run-dialog.component.html',
  styles: [``]
})
export class AlcanceRunDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AlcanceRunDialogComponent>,
    private fb: FormBuilder
  ) {
    this.buildForm(data.periodo);
  }

  private buildForm(periodo: Periodo) {
    this.form = this.fb.group({
      fechaInicial: [periodo.fechaInicial, Validators.required],
      fechaFinal: [periodo.fechaFinal, Validators.required],
      meses: [2, Validators.required]
    });
  }

  ngOnInit() {}

  cancelar() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const command = {
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString(),
        meses: this.form.get('meses').value
      };
      this.dialogRef.close(command);
    }
  }
}
