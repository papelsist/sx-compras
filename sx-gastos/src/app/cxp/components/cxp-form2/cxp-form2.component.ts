import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CuentaPorPagar } from 'app/cxp/model';

@Component({
  selector: 'sx-cxp-form2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'cxp-form2.component.html',
  styleUrls: ['./cxp-form2.component.scss']
})
export class CxpForm2Component implements OnInit {
  form: FormGroup;
  @Input()
  cxp: Partial<CuentaPorPagar>;
  @Output()
  update = new EventEmitter<{ id: string; changes: Partial<CuentaPorPagar> }>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      importePorPagar: [this.cxp.importePorPagar, [Validators.required]],
      comentario: [null]
    });
  }

  submit() {}
}
