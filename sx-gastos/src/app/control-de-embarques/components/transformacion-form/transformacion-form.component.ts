import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Transformacion } from 'app/control-de-embarques/model';

@Component({
  selector: 'sx-transformacion-form',
  templateUrl: 'transformacion-form.component.html'
})
export class TransformacionFormComponent implements OnInit {
  form: FormGroup;
  trs: Transformacion;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<
      TransformacionFormComponent,
      { id: string; changes: Partial<Transformacion> }
    >
  ) {
    this.trs = data.transformacion;
  }

  ngOnInit() {
    this.form = new FormGroup({
      chofer: new FormControl(this.trs.chofer, [Validators.required])
    });
    console.log('For,: ', this.form.value);
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = {
        id: this.trs.id,
        changes: { ...this.form.value }
      };
      this.dialogRef.close(payload);
    }
  }
}
