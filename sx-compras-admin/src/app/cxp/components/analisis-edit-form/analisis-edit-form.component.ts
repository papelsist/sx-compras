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
import { CuentaPorPagar } from '../../model/cuentaPorPagar';

@Component({
  selector: 'sx-analisis-edit-form',
  templateUrl: './analisis-edit-form.component.html',
  styles: [
    `
    .partidas-panel {
      min-height: 300px;
      max-height: 600px;
      overflow: auto;
    }
    .totales-panel {

      padding: 5px 15px 5px 15px;
    }
    `
  ]
})
export class AnalisisEditFormComponent implements OnInit {
  @Input() analisis: Analisis;
  @Input() comsDisponibles: RecepcionDeCompra[];
  @Output() update = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() cerrar = new EventEmitter();
  @Output() print = new EventEmitter();

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
      importe: [this.analisis.importe],
      pendiente: [0.0],
      partidas: this.fb.array([])
    });
    this.analisis.partidas.forEach(item => {
      this.partidas.push(new FormControl(item));
    });
    if (this.analisis.cerrado) {
      this.form.disable();
    }
    this.actualizar();
  }

  onSubmit() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  get partidas() {
    return this.form.get('partidas') as FormArray;
  }

  onAgregarCom() {
    const dialogRef = this.dialog.open(ComsSelectorComponent, {
      data: { title: 'COMs pendientes', coms: this.comsDisponibles },
      width: '750px'
    });
    dialogRef.afterClosed().subscribe((selected: RecepcionDeCompra[]) => {
      if (selected) {
        selected.forEach(item => {
          item.partidas.forEach(com => {
            console.log('Agregando COM: ', com);
            if (com.cantidad - com.analizado > 0) {
              const det = buildFromCom(com);
              this.partidas.push(new FormControl(det));
              this.actualizar();
              this.form.markAsDirty();
            }
          });
        });
      }
    });
  }

  onUpdateRow(event: AnalisisDet) {
    this.actualizar();
    this.form.markAsDirty();
  }

  onDeleteRow(index: number) {
    this.partidas.removeAt(index);
    this.actualizar();
    this.form.markAsDirty();
  }

  private actualizar() {
    const importe = _.sumBy(this.partidas.value, 'importe');
    this.form.get('importe').setValue(importe);
    const pendiente = 1 - importe / this.factura.subTotal;
    this.form.get('pendiente').setValue(pendiente);
  }

  get factura(): CuentaPorPagar {
    return this.analisis.factura;
  }

  get importe(): number {
    return this.form.value.importe;
  }

  get diferencia() {
    const subTotal = this.factura.subTotal;
    const analizado = this.importe;
    return _.round(subTotal - analizado);
  }
  get diferenciaPorcentaje() {
    const subTotal = this.factura.subTotal;
    return _.round(this.diferencia / subTotal);
  }
  get pendiente() {
    return this.form.get('pendiente').value;
  }
}
