import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';
import {
  Bonificacion,
  CuentaPorCobrar,
  NotaDeCreditoDet,
  buildNotaDet
} from 'app/cobranza/models';

@Component({
  selector: 'sx-bonificacion-form',
  templateUrl: './bonificacion-form.component.html',
  styleUrls: ['./bonificacion-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonificacionFormComponent implements OnInit {
  @Input() bonificacion: Bonificacion;

  form: FormGroup;

  @Output() save = new EventEmitter();

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

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
      comentario: [],
      partidas: this.fb.array([])
    });
  }

  addFacturas(facturas: CuentaPorCobrar[]) {
    facturas.forEach(cxc => {
      const det = buildNotaDet(cxc);
      console.log('Agregando: ', det);
      const found = this.partidasData.find(
        item => item.cuentaPorCobrar.id === cxc.id
      );
      if (!found) {
        this.partidas.push(new FormControl(det));
      }
    });
    this.form.markAsDirty();
    this.cd.detectChanges();
  }

  submit() {
    if (this.form.valid) {
      const res = { ...this.form.value };
      res.partidas = this.partidasData;
      const update = { id: this.bonificacion.id, changes: res };
      this.save.emit(update);
    }
  }

  get partidasData(): Partial<NotaDeCreditoDet>[] {
    return this.partidas.value;
  }

  get partidas(): FormArray {
    return this.form.get('partidas') as FormArray;
  }
}
