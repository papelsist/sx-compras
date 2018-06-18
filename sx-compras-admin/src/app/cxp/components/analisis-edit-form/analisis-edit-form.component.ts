import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';

import { MatDialog } from '@angular/material';

import { ComsSelectorComponent } from '../coms-selector/coms-selector.component';
import { Analisis } from '../../model/analisis';
import { AnalisisDet, buildFromCom } from '../../model/analisisDet';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';

import * as _ from 'lodash';

@Component({
  selector: 'sx-analisis-edit-form',
  templateUrl: './analisis-edit-form.component.html',
  styles: [
    `
    .partidas-panel {
      min-height: 350px;
      max-height: 700px;
      overflow: auto;
    }
    `
  ]
})
export class AnalisisEditFormComponent implements OnInit {
  @Input() analisis: Analisis;
  @Input() comsDisponibles: RecepcionDeCompra[];
  @Output() update = new EventEmitter();
  @Output() cancel = new EventEmitter();

  form: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      id: [this.analisis.id],
      factura: [this.analisis.factura.id],
      comentario: [this.analisis.comentario],
      fecha: [this.analisis.fecha, [Validators.required]],
      partidas: this.fb.array([])
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  get totalAnalizado(): number {
    return _.sumBy(this.partidas.value.importe);
  }

  onAgregarCom() {
    const dialogRef = this.dialog.open(ComsSelectorComponent, {
      data: { title: 'COMs pendientes', coms: this.comsDisponibles },
      width: '750px'
    });
    dialogRef.afterClosed().subscribe((selected: RecepcionDeCompra[]) => {
      if (selected) {
        console.log('Recepcion de Compra: ', selected);
        selected.forEach(item => {
          item.partidas.forEach(com => {
            console.log('COM: ', com);
            const det = buildFromCom(com);
            this.partidas.push(new FormControl(det));
          });
        });
      }
    });
  }
}
