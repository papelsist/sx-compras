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
  selector: 'sx-proveedor-generales-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-generales-form.component.html',
  styleUrls: ['./proveedor-generales-form.component.scss']
})
export class ProveedorGeneralesFormComponent implements OnInit {
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
      nombre: [
        '',
        [Validators.required, Validators.min(5), Validators.max(255)]
      ],
      clave: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(6)]
      ],
      rfc: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13)
        ]
      ],
      tipo: ['COMPRAS', [Validators.required]],
      activo: [true, [Validators.required]],
      nacional: [true, [Validators.required]],
      comentario: [],
      telefono1: [null],
      telefono2: [null],
      telefono3: [null]
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
