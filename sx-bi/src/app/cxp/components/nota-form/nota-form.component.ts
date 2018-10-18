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

import {
  NotaDeCreditoCxP,
  NotaDeCreditoCxPDet,
  CuentaPorPagar
} from '../../model';

import { Subject } from 'rxjs';

@Component({
  selector: 'sx-nota-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nota-form.component.html',
  styleUrls: ['./nota-form.component.scss']
})
export class NotaFormComponent implements OnInit, OnChanges {
  @Input() nota: NotaDeCreditoCxP;
  @Output() save = new EventEmitter<NotaDeCreditoCxP>();
  @Output() aplicar = new EventEmitter<NotaDeCreditoCxP>();
  @Output() quitarAplicacion = new EventEmitter<any>();
  @Output() agregarAplicaciones = new EventEmitter<any>();
  @Output() pdf = new EventEmitter<NotaDeCreditoCxP>();

  @Input() cuentasPorPagar: CuentaPorPagar[] = [];

  tipos = ['DESCUENTO', 'DESCUENTO_FINANCIERO', 'BONIFICACION'];

  search$ = new Subject();

  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      this.buildForm();
    }
    if (changes.nota && changes.nota.currentValue) {
      // console.log('Nota: ', changes.nota.currentValue);
      const not = changes.nota.currentValue;
      this.form.patchValue(not);
      this.clarPartidas();
      not.conceptos.forEach(item => this.conceptos.push(new FormControl(item)));
    }
  }

  buildForm() {
    this.form = this.fb.group({
      concepto: [null, [Validators.required]],
      comentario: [],
      conceptos: this.fb.array([])
    });
  }

  private clarPartidas() {
    while (this.conceptos.length !== 0) {
      this.conceptos.removeAt(0);
    }
  }

  onSave() {
    if (this.form.valid) {
      const res = {
        ...this.nota,
        ...this.form.value
      };
      this.save.emit(res);
      this.form.markAsPristine();
    }
  }

  get conceptos() {
    return this.form.get('conceptos') as FormArray;
  }

  onSearch(event: string) {
    const search = event !== '' ? event : ' ';
    this.search$.next(search.toLowerCase());
  }
}
