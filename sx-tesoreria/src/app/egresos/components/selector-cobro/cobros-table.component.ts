import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import * as _ from 'lodash';
import { Cobro } from 'app/ingresos/models';

@Component({
  selector: 'sx-cobros-table',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <table mat-table [dataSource]="dataSource" matSort>
    <ng-container matColumnDef="tipo">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Tipo</th>
      <td mat-cell *matCellDef="let row">{{ row.tipo }}</td>
      <td mat-footer-cell *matFooterCellDef></td>
    </ng-container>
    <ng-container matColumnDef="sucursalNombre">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Sucursal</th>
      <td mat-cell *matCellDef="let row">{{ row.sucursalNombre }}</td>
      <td mat-footer-cell *matFooterCellDef></td>
    </ng-container>
    <ng-container matColumnDef="nombre">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Cliente</th>
      <td mat-cell *matCellDef="let row">{{ row.nombre }}</td>
      <td mat-footer-cell *matFooterCellDef></td>
    </ng-container>
    <ng-container matColumnDef="fecha">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Fecha</th>
      <td mat-cell *matCellDef="let row">
        {{ changeDate(row.fecha) | date: 'dd/MM/yyyy' }}
      </td>
      <td mat-footer-cell *matFooterCellDef> Total</td>
    </ng-container>
    <ng-container matColumnDef="formaDePago">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>F. Pago</th>
      <td mat-cell *matCellDef="let row">{{ row.formaDePago }}</td>
      <td mat-footer-cell *matFooterCellDef></td>
    </ng-container>
    <ng-container matColumnDef="importe">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Importe</th>
      <td mat-cell *matCellDef="let row">{{ row.importe | currency }}</td>
      <td mat-footer-cell *matFooterCellDef>{{getTotal('importe') | currency}}</td>
    </ng-container>
    <ng-container matColumnDef="aplicado">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Aplicado</th>
      <td mat-cell *matCellDef="let row">{{ row.importe | currency }}</td>
      <td mat-footer-cell *matFooterCellDef>{{getTotal('aplicado') | currency}}</td>
    </ng-container>
    <ng-container matColumnDef="saldo">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Disponible</th>
      <td mat-cell *matCellDef="let row">{{ row.saldo | currency }}</td>
      <td mat-footer-cell *matFooterCellDef>{{getTotal('saldo') | currency}}</td>
    </ng-container>
    <ng-container matColumnDef="referencia">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Referencia</th>
      <td mat-cell *matCellDef="let row">{{ row.referencia }}</td>
      <td mat-footer-cell *matFooterCellDef></td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayColumns" class="cursor-pointer"
      (click)="toogleSelect(row)"
      [ngClass]="{ active: row.selected }"></tr>
    <tr mat-footer-row *matFooterRowDef="displayColumns"></tr>
  </table>
  <mat-paginator [pageSizeOptions]="[10, 20]" showFirstLastButtons></mat-paginator>
  `,
  styles: [
    `
      table {
        width: 100%;
        // min-height: 200px;
        max-height: 750px;
        overflow-x: auto;
        padding: 0px 30px 0 30px;
      }
      .mat-cell {
        font-size: 11px;
      }
      .mat-row {
        height: 30px;
      }
    `
  ]
})
export class CobrosTableComponent implements OnInit, OnChanges {
  @Input()
  cobros: Cobro[] = [];

  @Input()
  multipleSelection = true;

  dataSource = new MatTableDataSource<Cobro>([]);

  displayColumns = [
    'tipo',
    'sucursalNombre',
    // 'nombre',
    'fecha',
    'formaDePago',
    'importe',
    'aplicado',
    'saldo',
    'referencia'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @Output()
  select = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cobros && changes.cobros.currentValue) {
      this.dataSource.data = changes.cobros.currentValue;
    }
  }

  toogleSelect(event: Cobro) {
    if (this.multipleSelection) {
      event.selected = !event.selected;
      const data = this.cobros.filter(item => item.selected);
      this.select.emit([...data]);
    } else {
      event.selected = !event.selected;
      this.cobros.forEach(item => {
        if (item.id !== event.id) {
          item.selected = false;
        }
      });
      this.select.emit([event]);
    }
  }

  getTotal(property: string) {
    return Math.abs(_.sumBy(this.dataSource.filteredData, property));
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
