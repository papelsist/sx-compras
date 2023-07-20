import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

@Component({
  selector: 'sx-existencia-semana-report-dialog',
  templateUrl: './existencia-semana-report-dialog.component.html',
  styles: [``]
})
export class ExistenciaSemanaReportDialogComponent implements OnInit {
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExistenciaSemanaReportDialogComponent>,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      fechaFinal: [null, Validators.required],
    });
  }
  ngOnInit() {}

  cancelar() {
    this.dialogRef.close(null);
  }

   onSubmit() {
        if (this.form.valid) {
            const fechaFinal: Date = this.form.get('fechaFinal').value;
            const command = {
                fechaFinal: fechaFinal.toISOString()
            };
            this.dialogRef.close(command);
        }
    }
}
