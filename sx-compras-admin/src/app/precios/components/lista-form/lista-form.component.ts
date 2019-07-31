import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListaDePreciosVenta } from 'app/precios/models';

@Component({
  selector: 'sx-lista-form',
  templateUrl: './lista-form.component.html',
  styleUrls: ['./lista-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaFormComponent implements OnInit {
  form: FormGroup;
  @Input() lista: Partial<ListaDePreciosVenta>;
  @Output() save = new EventEmitter<Partial<ListaDePreciosVenta>>();

  constructor(private fb: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = this.fb.group({
      fecha: [new Date(), Validators.required],
      inicio: [null, [Validators.required]],
      descripcion: [null, Validators.required],
      linea: ['TODAS', Validators.required],
      moneda: ['MXN', Validators.required],
      tipoDeCambio: [1.0, Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      const res = {
        ...this.form.value
      };
      this.save.emit(res);
    }
  }

  isValid() {
    return this.form.valid;
  }
}
