import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource, MatTable } from '@angular/material';

import { AnalisisDet } from '../../model/analisisDet';

import * as _ from 'lodash';

@Component({
  selector: 'sx-analisis-partidas-table',
  template: `
  <div [formGroup]="parent">
    <table mat-table formArrayName="partidas" [dataSource]="partidas">
      <ng-container matColumnDef="producto">
        <th mat-header-cell *matHeaderCellDef >Producto</th>
        <td mat-cell *matCellDef="let row">{{row.com.producto.clave}}</td>
      </ng-container>
      <ng-container matColumnDef="descripcion">
        <th mat-header-cell *matHeaderCellDef >Descripción</th>
        <td mat-cell *matCellDef="let row">{{row.com.producto.descripcion}}</td>
      </ng-container>
      <ng-container matColumnDef="cantidad">
        <th mat-header-cell *matHeaderCellDef >Cantidad</th>
        <td mat-cell *matCellDef="let row">{{row.cantidad}}</td>
      </ng-container>
      <ng-container matColumnDef="precio">
        <th mat-header-cell *matHeaderCellDef >Precio</th>
        <td mat-cell *matCellDef="let row">
          <input type="number" (input)="asignarPrecio($event.target.value, row)">
        </td>
      </ng-container>
      <ng-container matColumnDef="desc1">
        <th mat-header-cell *matHeaderCellDef >Desc 1</th>
        <td mat-cell *matCellDef="let row">
          <input type="number" [(ngModel)]="row.desc1" [ngModelOptions]="{standalone: true}" (input)="actualizar(row)">
        </td>
      </ng-container>
      <ng-container matColumnDef="importe">
        <th mat-header-cell *matHeaderCellDef >Importe</th>
        <td mat-cell *matCellDef="let row">
          {{row.importe | currency}}
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
      <tr mat-row *matRowDef="let cfdi; columns: displayColumns"></tr>
    </table>
  </div>
  `,
  styles: [
    `
    table {
      width: 100%;
      overflow: auto;
    }
    .mat-cell {
      font-size: 11px;
    }
    .mat-row {
      height: 30px;
    }

    .mat-column-precio {
      width: 100px;
    }
    .mat-column-desc1 {
      width: 100px;
      padding: 0px;
    }

    td {
      .mat-column-precio {
        max-width: 150px;
      }
    }

    td .mat-cell .mat-column-precio{
      padding: 0;
    }

    table td input {
      width: 90%;
      height:100%;
    }
  `
  ]
})
export class AnalisisPartidasTableComponent implements OnInit {
  @Input() partidas: any[] = [];
  @Input() parent: FormGroup;
  @Output() update = new EventEmitter();
  displayColumns = [
    'producto',
    'descripcion',
    'cantidad',
    'precio',
    'desc1',
    'importe'
  ];

  @ViewChild('table') table: MatTable<any>;

  constructor() {}

  ngOnInit() {}

  refresh() {
    this.table.renderRows();
  }

  asignarPrecio(precio: number, row: AnalisisDet) {
    row.precioDeLista = precio;
    this.actualizar(row);
  }

  actualizar(row: AnalisisDet) {
    const { cantidad, precioDeLista, desc1 } = row;
    const importeBtuto = cantidad * precioDeLista;
    let importe = importeBtuto;
    if (desc1) {
      const impDesc1 = this.getImporteDescuento(importe, desc1);
      importe = importe - impDesc1;
    }
    row.importe = importe;
    this.update.emit(row);
  }

  private getImporteDescuento(importe: number, descuento: number) {
    return _.round(importe * (descuento / 100));
  }
}
