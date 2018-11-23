import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-cxp-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cxp-form.component.html'
})
export class CxPFormComponent implements OnInit {
  form: FormGroup;
  cxp: CuentaPorPagar;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, fb: FormBuilder) {
    this.cxp = data.cxp;
    this.form = fb.group({
      importePorPagar: [this.cxp.importePorPagar, [Validators.required]]
    });
  }

  ngOnInit() {}
}
