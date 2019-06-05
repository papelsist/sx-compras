import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Bonificacion } from 'app/cobranza/models';

@Component({
  selector: 'sx-bonificacion-form',
  templateUrl: './bonificacion-form.component.html',
  styleUrls: ['./bonificacion-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonificacionFormComponent implements OnInit {
  @Input() bonificacion: Bonificacion;

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.form.patchValue(this.bonificacion);
  }

  private buildForm() {
    this.form = this.fb.group({
      tipoDeCalculo: ['PORCENTAJE', [Validators.required]],
      baseDelCalculo: ['SALDO'],
      descuento: [0.0],
      descuento2: [0.0],
      importe: [0.0],
      comentario: []
    });
  }
}
