import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'sx-nota-form',
  templateUrl: './nota-form.component.html',
  styleUrls: ['./nota-form.component.scss']
})
export class NotaFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      tipoDeCalculo: ['PORCENTAJE', [Validators.required]],
      comentario: []
    });
  }
}
