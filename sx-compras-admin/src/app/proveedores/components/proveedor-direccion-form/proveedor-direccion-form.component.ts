import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Proveedor } from '../../models/proveedor';

@Component({
  selector: 'sx-proveedor-direccion-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-direccion-form.component.html',
  styleUrls: ['./proveedor-direccion-form.component.scss']
})
export class ProveedorDireccionFormComponent implements OnInit {
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
      direccion: this.fb.group({
        calle: [],
        numeroExterior: [],
        numeroInterior: [],
        codigoPostal: [],
        colonia: [],
        estado: [],
        municipio: [],
        pais: []
      })
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
