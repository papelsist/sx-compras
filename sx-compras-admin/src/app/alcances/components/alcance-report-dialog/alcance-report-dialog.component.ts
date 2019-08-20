import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators
} from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Periodo } from '../../../_core/models/periodo';

@Component({
  selector: 'sx-alcance-report-dialog',
  templateUrl: './alcance-report-dialog.component.html',
  styles: [``]
})
export class AlcanceReportDialogComponent implements OnInit {
  form: FormGroup;
  lineas = [
    'TODAS',
    'ADHESIVOS',
    'AUTOCOPIANTE',
    'BOND',
    'BRISTOL',
    'CAPLE',
    'CLASICOS',
    'CONTABLE',
    'COUCHE',
    'CUBIERTOS',
    'EUROKOTE',
    'GALGOS',
    'HIGIENICOS',
    'INSPIRA',
    'MANILA',
    'MATERIAL DE EMPAQUE',
    'METALIZADOS',
    'OPALINA',
    'PAPELES FINOS',
    'POLYPAP',
    'SBS SULFATADA',
    'SIN ASIGNAR',
    'SOBRES Y FOLDERS',
    'TYVEK',
    'VARIOS',
    '°CORTES ESPECIALES',
    '°TINTAS'
  ];

  ordenes = [
    { clave: '5', descripcion: 'CLAVE' },
    { clave: '11', descripcion: 'PROMEDIO VTA' },
    { clave: '12', descripcion: 'ALCANCE INVENT' }
  ];

  tipos = [
    { clave: 'TODOS', value: ' ' },
    { clave: 'DE LINEA', value: 'AND DE_LINEA IS TRUE' },
    { clave: 'ESPECIAL', value: 'AND DE_LINEA IS FALSE' }
  ];

  filtros = ['TODOS', 'ALCANCE MENOR', 'ALCANCE MAYOR'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AlcanceReportDialogComponent>,
    private fb: FormBuilder
  ) {
    this.buildForm(data.periodo);
  }

  private buildForm(periodo: Periodo) {
    this.form = this.fb.group({
      fechaInicial: [periodo.fechaInicial, Validators.required],
      fechaFinal: [periodo.fechaFinal, Validators.required],
      LINEA: ['TODAS'],
      ORDEN: [null, Validators.required],
      FORMA: ['ASC', Validators.required],
      MESES: [2, Validators.required],
      MESESF: [2],
      DELINEA: [null, Validators.required],
      FILTRADO: ['TODOS', Validators.required]
    });
  }

  ngOnInit() {}

  cancelar() {
    this.dialogRef.close(null);
  }

  onSubmit() {
    if (this.form.valid) {
      const fechaInicial: Date = this.form.get('fechaInicial').value;
      const fechaFinal: Date = this.form.get('fechaFinal').value;
      const command = {
        ...this.form.value,
        fechaInicial: fechaInicial.toISOString(),
        fechaFinal: fechaFinal.toISOString()
      };
      if (command.LINEA === 'TODAS') {
        command.LINEA = '%';
      }
      // console.log('PARAMS: ', command);
      this.dialogRef.close(command);
    }
  }
}
