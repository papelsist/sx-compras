import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Cartera } from 'app/cobranza/models';

@Component({
  selector: 'sx-nota-create-modal',
  templateUrl: './nota-create-modal.component.html',
  styleUrls: ['./nota-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotaCreateModalComponent implements OnInit {
  @Input() tipo: string;
  @Input() cartera: Cartera;
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<NotaCreateModalComponent>,
    private fb: FormBuilder
  ) {
    this.tipo = data.tipo;
    this.cartera = data.cartera;
  }

  ngOnInit() {
    this.form = this.fb.group({
      cliente: [null, [Validators.required]],
      fecha: [new Date(), [Validators.required]],
      moneda: ['MXN', [Validators.required]],
      tipoDeCambio: [{ value: 1.0, disabled: true }, [Validators.required]],
      comentario: []
    });
  }

  submit() {
    if (this.form.valid) {
      const res = {
        ...this.form.value
      };
      res.fecha = (this.form.get('fecha').value as Date).toISOString();
      res.tipo = this.tipo;
      res.tipoCartera = this.cartera.clave;
      res.cliente = this.form.get('cliente').value.id;
      this.dialogRef.close(res);
    }
  }
}
