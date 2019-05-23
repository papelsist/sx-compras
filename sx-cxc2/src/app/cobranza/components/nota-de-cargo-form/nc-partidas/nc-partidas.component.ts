import { Component, OnInit, Input } from '@angular/core';
import { NotaDeCargo } from 'app/cobranza/models';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'sx-nc-partidas',
  template: `
  <td-data-table [columns]="columns" [data]="nota.partidas" [style.height.px]="270">
    <ng-template tdDataTableTemplate="documentoFecha" let-value="value" let-row="row">
      {{value | date: 'dd/MM/yyyy'}}
    </ng-template>
    <ng-template tdDataTableTemplate="documentoTotal" let-value="value" let-row="row">
      {{value | currency}}
    </ng-template>
    <ng-template tdDataTableTemplate="documentoSaldo" let-value="value" let-row="row">
      {{value | currency}}
    </ng-template>
    <ng-template tdDataTableTemplate="total" let-value="value" let-row="row">
      {{value | currency}}
    </ng-template>
  </td-data-table>
  `
})
export class NcPartidasComponent implements OnInit {
  @Input()
  nota: NotaDeCargo;
  @Input()
  columns: ITdDataTableColumn[] = [
    { name: 'concepto', label: 'Concepto', numeric: false },
    { name: 'documentoTipo', label: 'Tipo', numeric: true, width: 80 },
    { name: 'documento', label: 'Docto', numeric: true, width: 120 },
    { name: 'documentoFecha', label: 'Fecha', numeric: false, width: 100 },
    { name: 'documentoTotal', label: 'Total Dcto', numeric: true, width: 150 },
    { name: 'documentoSaldo', label: 'Saldo Dcto', numeric: true, width: 150 },
    { name: 'total', label: 'Cargo', numeric: true },
    { name: 'comentario', label: 'Comentario', numeric: false }
  ];

  constructor() {}

  ngOnInit() {
    console.log('NotaDeCargo: ', this.nota);
  }
}
