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
  selector: 'sx-proveedor-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent implements OnInit {
  @Input() proveedor: Proveedor;
  @Output() save = new EventEmitter<Proveedor>();
  @Output() cancel = new EventEmitter<Proveedor>();
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
      telefono3: [null],
      // Linea de credito
      plazo: [0, [Validators.required]],
      limiteDeCredito: [0, [Validators.required, Validators.min(0)]],
      descuentoF: [0, [Validators.required]],
      diasDF: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ],
      fechaRevision: [false],
      imprimirCosto: [false],
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

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.preparEntity());
      this.form.markAsPristine();
    }
  }

  private preparEntity() {
    const res = {
      ...this.proveedor,
      ...this.form.value
    };
    return res;
  }
}
