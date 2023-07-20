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
  grupos: any[] = [];
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

  @Output()
  updateEcommerce = new EventEmitter();

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
            Validators.minLength(4),
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
      grupo: [null],
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
      hojasPaquete: [0, Validators.required],
      stock: [0, Validators.required],
      activo: [true],
      inventariable: [true],
      activoEcommerce: [false],
      paquete: [false],
      precioContado: [null, [Validators.required, Validators.min(1)]],
      precioCredito: [null, [Validators.required, Validators.min(1)]],
      precioTarjeta: [null, [Validators.required, Validators.min(1)]],
      largo: [0, Validators.required],
      ancho: [0, Validators.required],
      proveedorFavorito: [null],
      productoSat: [],
      unidadSat: [],
      clasificacionEcommerce: [],
      usoEcommerce: [],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const prod = {
        ...this.producto,
        ...this.form.value
      };
      const { fechaLista, ...rest } = prod;
      console.log('Producto actualizar: ', rest);
      this.save.emit(rest);
    }
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
