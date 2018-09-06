import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';

import { RecepcionDeCompra } from '../../models/recepcionDeCompra';
import { RecepcionDeCompraDet } from '../../models/recepcionDeCompraDet';

@Component({
  selector: 'sx-com-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './com-form.component.html',
  styleUrls: ['./com-form.component.scss']
})
export class ComFormComponent implements OnInit, OnChanges {
  @Input() com: Partial<RecepcionDeCompra>;
  @Output() save = new EventEmitter<Partial<RecepcionDeCompra>>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.com && changes.com.currentValue) {
      console.log('Editando com:', changes.com.currentValue);
      const com = changes.com.currentValue;
      this.clarPartidas();
      this.form.patchValue(com);
      com.partidas.forEach(item => this.partidas.push(new FormControl(item)));
    }
  }

  private clarPartidas() {
    while (this.partidas.length !== 0) {
      this.partidas.removeAt(0);
    }
  }

  buildForm() {
    this.form = this.fb.group({
      fecha: [{ value: new Date(), disabled: true }, [Validators.required]],
      compra: [null, [Validators.required]],
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  onSave() {
    if (this.form.valid) {
      let fecha = this.form.value.fecha;
      if (fecha instanceof Date) {
        fecha = fecha.toISOString();
      }
      const partidas = [...this.partidas.value];
      const res = {
        ...this.form.value,
        fecha,
        partidas
      };

      this.save.emit(res);
      this.form.markAsPristine();
    }
  }

  onEditPartida(index: number, cantidad: number) {
    const control = this.partidas.at(index);
    const det: RecepcionDeCompraDet = control.value;
    det.cantidad = cantidad;
    this.partidas.setControl(index, new FormControl(det));
    this.form.markAsDirty();
  }

  onInsertPartida(event: RecepcionDeCompraDet) {
    this.partidas.push(new FormControl(event));
    this.form.markAsDirty();
  }

  onDeletePartida(index: number) {
    this.partidas.removeAt(index);
    this.form.markAsDirty();
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }
}
