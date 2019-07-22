import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-proveedor-credito-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-credito-form.component.html',
  styleUrls: ['./proveedor-credito-form.component.scss']
})
export class ProveedorCreditoFormComponent implements OnInit {
  @Input() proveedor: Proveedor;
  @Output() save = new EventEmitter<Partial<Proveedor>>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    if (this.proveedor) {
      this.form.patchValue(this.proveedor);
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      // Linea de credito
      plazo: [0, [Validators.required]],
      limiteDeCredito: [0, [Validators.required, Validators.min(0)]],
      descuentoF: [0, [Validators.required]],
      diasDF: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      fechaRevision: [false],
      imprimirCosto: [false]
    });
  }

  submit() {
    if (this.form.valid) {
      this.save.emit(this.preparEntity());
      this.form.markAsPristine();
    }
  }

  private preparEntity() {
    const changes: Partial<Proveedor> = {
      ...this.form.value
    };
    if (this.proveedor) {
      return { id: this.proveedor.id, changes };
    }
    return changes;
  }

  canSave() {
    return this.form.valid && this.form.pristine;
  }
}
