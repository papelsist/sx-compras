import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'sx-envio-comision-form',
  template: `
  <h2 mat-dialog-title>Modificación de comisiones por envio</h2>
  <mat-dialog-content>
    
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>Canelar</button>
    <button mat-button (click)="onSubmit()">Aceptar</button>
  </mat-dialog-actions>
`
})
export class EnvioComisionFormComponent implements OnInit {
  
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EnvioComisionFormComponent>,
    fb: FormBuilder
  ) {
    this.form = fb.group({});
  }

  ngOnInit() {}

  onSubmit() {
    if(this.form.valid) {
      const data = {
        ...this.form.value
      };
      this.dialogRef.close(data);
    }
  }
}
