import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sx-compra-partida-form',
  templateUrl: './compra-partida-form.component.html'
})
export class CompraPartidaFormComponent implements OnInit {
  proveedor: any;
  productos: any[];
  form: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.proveedor = data.proveedor;
    this.productos = data.productos;
    this.form = new FormGroup({
      producto: new FormControl(null, [Validators.required]),
      solicitado: new FormControl(0, [Validators.required, Validators.min(1)]),
      comentario: new FormControl()
    });
  }

  ngOnInit() {}
}
