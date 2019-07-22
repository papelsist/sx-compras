import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import { Producto } from '../../models/producto';

@Component({
  selector: 'sx-producto-form',
  templateUrl: './producto-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent implements OnInit {
  @Input()
  producto: Producto;
  @Input()
  lineas: any[] = [];
  @Input()
  marcas: any[] = [];
  @Input()
  clases: any[] = [];
  @Output()
  save = new EventEmitter();
  @Output()
  delete = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    if (this.producto) {
      console.log('Editando producto: ', this.producto);
      this.form.patchValue(this.producto);
      // this.form.markAsPristine();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      clave: [
        null,
        {
          validators: [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(15)
          ],
          updateOn: 'blur'
        }
      ],
      descripcion: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200)
        ]
      ],
      linea: [null, [Validators.required]],
      clase: [null],
      marca: [null],
      unidad: ['MILLAR', [Validators.required]],
      presentacion: ['EXTENDIDO', [Validators.required]],
      modoVenta: ['B', Validators.required],
      color: [null, Validators.maxLength(15)],
      nacional: [true],
      deLinea: [true],
      kilos: [0, Validators.required],
      gramos: [0, Validators.required],
      calibre: [0, Validators.required],
      caras: [0, Validators.required],
      m2XMillar: [0, Validators.required],
      activo: [true],
      inventariable: [true],
      precioContado: [null, [Validators.required, Validators.min(1)]],
      precioCredito: [null, [Validators.required, Validators.min(1)]],
      largo: [0, Validators.required],
      ancho: [0, Validators.required],
      proveedorFavorito: [null],
      productoSat: [],
      unidadSat: []
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const prod = {
        ...this.producto,
        ...this.form.value
      };
      this.save.emit(prod);
    }
  }
}
