import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'sx-listadet-batch-modal',
  templateUrl: './listadet-batch-modal.component.html',
  styleUrls: ['./listadet-batch-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListadetBatchModalComponent implements OnInit {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ListadetBatchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      tipo: [null, Validators.required],
      base: ['PRECIO ANTERIOR'],
      operador: [null, Validators.required],
      factor: [0.0, Validators.required]
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
