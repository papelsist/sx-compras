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
import { aplicarDescuentosEnCascada } from 'app/utils/money-utils';

@Component({
  selector: 'sx-analisis-partidas-table',
  template: `
  <div [formGroup]="parent">
    <table mat-table formArrayName="partidas" [dataSource]="partidas">
      <ng-container matColumnDef="sucursal">
        <th mat-header-cell *matHeaderCellDef >Sucursal</th>
        <td mat-cell *matCellDef="let row">{{row.sucursal}}</td>
      </ng-container>
      <ng-container matColumnDef="remision">
        <th mat-header-cell *matHeaderCellDef >Remisión</th>
        <td mat-cell *matCellDef="let row">{{row.remision}}</td>
      </ng-container>
      <ng-container matColumnDef="com">
        <th mat-header-cell *matHeaderCellDef >COM</th>
        <td mat-cell *matCellDef="let row">{{row.folioCom}}</td>
      </ng-container>
      <ng-container matColumnDef="producto">
        <th mat-header-cell *matHeaderCellDef >Producto</th>
        <td mat-cell *matCellDef="let row">{{row.clave}}</td>
      </ng-container>
      <ng-container matColumnDef="descripcion">
        <th mat-header-cell *matHeaderCellDef >Descripción</th>
        <td mat-cell *matCellDef="let row">{{row.descripcion}}</td>
      </ng-container>
      <ng-container matColumnDef="cantidad">
        <th mat-header-cell *matHeaderCellDef >Cantidad</th>
        <td mat-cell *matCellDef="let row">{{row.cantidad}}</td>
      </ng-container>
      <ng-container matColumnDef="precio">
        <th mat-header-cell *matHeaderCellDef >Precio</th>
        <td mat-cell *matCellDef="let row">
          <input type="number" (input)="asignarPrecio($event.target.value, row)" [value]="row.precioDeLista">
        </td>
      </ng-container>
      <ng-container matColumnDef="desc1">
        <th mat-header-cell *matHeaderCellDef >Desc 1</th>
        <td mat-cell *matCellDef="let row">
          <input type="number" [(ngModel)]="row.desc1" [ngModelOptions]="{standalone: true}" (input)="actualizar(row)">
        </td>
      </ng-container>
      <ng-container matColumnDef="desc2">
        <th mat-header-cell *matHeaderCellDef >Desc 2</th>
        <td mat-cell *matCellDef="let row">
          <input type="number" [(ngModel)]="row.desc2" [ngModelOptions]="{standalone: true}" (input)="actualizar(row)">
        </td>
      </ng-container>

      <ng-container matColumnDef="desc3">
        <th mat-header-cell *matHeaderCellDef >Desc 3</th>
        <td mat-cell *matCellDef="let row" class="descuento">
          <input type="number" [(ngModel)]="row.desc3" [ngModelOptions]="{standalone: true}" (input)="actualizar(row)">
        </td>
      </ng-container>

      <ng-container matColumnDef="desc4">
        <th mat-header-cell *matHeaderCellDef >Desc 4</th>
        <td mat-cell *matCellDef="let row"class="descuento">
          <input type="number" [(ngModel)]="row.desc4" [ngModelOptions]="{standalone: true}" (input)="actualizar(row)">
        </td>
      </ng-container>

      <ng-container matColumnDef="importe">
        <th mat-header-cell *matHeaderCellDef >Importe</th>
        <td mat-cell *matCellDef="let row">
          {{row.importe | currency}}
        </td>
      </ng-container>

      <ng-container matColumnDef="operaciones">
        <th mat-header-cell *matHeaderCellDef ></th>
        <td mat-cell *matCellDef="let row, let i = index">
          <mat-icon color="warn" class="cursor-pointer" (click)="delete.emit(i)">delete</mat-icon>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
      <tr mat-row *matRowDef="let cfdi; columns: displayColumns; "></tr>
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
    .mat-column-desc1, .mat-column-desc2 {
      width: 80px;
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

    .descuento {
      width: 80px;
      padding: 0px;
    }
  `
  ]
})
export class AnalisisPartidasTableComponent implements OnInit {
  @Input() partidas: AnalisisDet[] = [];
  @Input() parent: FormGroup;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();
  displayColumns = [
    'sucursal',
    'remision',
    'com',
    'producto',
    'descripcion',
    'cantidad',
    'precio',
    'desc1',
    'desc2',
    'desc3',
    'desc4',
    'importe',
    'operaciones'
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
    const { cantidad, precioDeLista, desc1, desc2, desc3, desc4 } = row;
    const importeBtuto = cantidad * precioDeLista / 1000;
    const importeNeto = aplicarDescuentosEnCascada(importeBtuto, [
      desc1,
      desc2,
      desc3,
      desc4
    ]);
    row.importe = importeNeto;
    this.update.emit(row);
  }

  private getImporteDescuento(importe: number, descuento: number) {
    return _.round(importe * (descuento / 100));
  }
}
