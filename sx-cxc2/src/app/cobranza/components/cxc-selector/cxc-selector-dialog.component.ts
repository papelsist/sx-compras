import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { TdDataTableColumnComponent } from '@covalent/core/data-table/data-table-column/data-table-column.component';
import { ITdDataTableColumn } from '@covalent/core/data-table/data-table.component';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { CxCService } from '../../services/cxc.service';

import { CuentaPorCobrar } from '../../models/';
import { Cliente } from 'app/models';

import * as _ from 'lodash';

@Component({
  selector: 'sx-cxc-selector-dialog',
  templateUrl: './cxc-selector-dialog.component.html',
  styles: [
    `
      .facturas-panel {
        min-height: 300px;
      }
      .footer {
        position: relative;
        left: 0px;
        bottom: 0px;
        height: 30px;
        width: 100%;
      }
    `
  ]
})
export class CxCSelectorDialogComponent implements OnInit {
  columns = [
    'sucursal',
    'tipo',
    'tipoDocumento',
    'fecha',
    'documento',
    'moneda',
    'total',
    'pagos',
    'saldo',
    'atraso'
  ];

  rows: CuentaPorCobrar[] = [];
  selected: CuentaPorCobrar[] = [];

  procesando = false;

  cliente: Cliente;
  cartera: any;
  search: string;
  maximoPermitido = -1;

  constructor(
    public dialogRef: MatDialogRef<CxCSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CxCService
  ) {
    this.cliente = data.cliente;
    this.cartera = data.cartera || 'CRE';
    this.maximoPermitido = data.maximoPermitido;
  }

  ngOnInit() {
    this.procesando = true;
    this.service
      .cuentasPorCobrar(this.cliente, this.cartera)
      .pipe(
        tap(() => (this.procesando = true)),
        finalize(() => (this.procesando = false))
      )
      .subscribe(res => (this.rows = res));
  }

  close() {
    this.dialogRef.close(this.selected);
  }

  onSearch(event: string) {
    this.search = event;
  }

  onSelect(event: CuentaPorCobrar[]) {
    this.selected = [...event];
  }

  getTotalSeleccionado() {
    return _.sumBy(this.selected, 'saldo');
  }

  getAplicable() {
    if (this.maximoPermitido > 0) {
      const porAplicar = this.getTotalSeleccionado();
      return this.maximoPermitido >= this.getTotalSeleccionado()
        ? this.getTotalSeleccionado()
        : this.maximoPermitido;
    }
    return 0;
  }
}
