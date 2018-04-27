import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sx-orden-det-form',
  templateUrl: './orden-det-form.component.html'
})
export class OrdenDetFormComponent implements OnInit {
  proveedor: any;
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.proveedor = data.proveedor;
    this.form = new FormGroup({
      producto: new FormControl(null, [Validators.required]),
      cantidad: new FormControl(0, [Validators.required, Validators.min(1)]),
      comentario: new FormControl()
    });
  }

  ngOnInit() {}
}
