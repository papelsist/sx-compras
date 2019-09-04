import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import * as _ from 'lodash';

import { GastoDet } from 'app/cxp/model';

@Component({
  selector: 'sx-cxp-activof-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-activof-modal.component.html'
})
export class CxpActivofModalComponent implements OnInit {
  form: FormGroup;
  gastoDet: Partial<GastoDet>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CxpActivofModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gastoDet = data.gastoDet;
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      serie: [],
      modelo: []
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
