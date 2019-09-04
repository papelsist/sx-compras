import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GridOptions
} from 'ag-grid-community';

import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

@Component({
  selector: 'sx-selector-requisiciones',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 mat-dialog-title>Requisiciones pendientes de recibo electrónico</h4>
    <div layout>
      <input
        (keyup)="grid.gridApi.setQuickFilter(box.value)"
        placeholder="Filtrar"
        flex
        #box
      />
    </div>
    <div class="grid-panel">
      <sx-requisiciones-selector-table
        #grid
        [partidas]="requisiciones"
        (select)="onSelection($event)"
      >
      </sx-requisiciones-selector-table>
    </div>
    <mat-dialog-content> </mat-dialog-content>
  `,
  styles: [
    `
      .grid-panel {
        height: 450px;
        width: 100%;
        overflow: auto;
      }
      input {
        margin: -15px 0 10px 0;
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-bottom: 2px solid #1976d2;
        width: 100%;
        font-size: 18px;
        line-height: 20px;
        height: 40px;
        text-align: center;
        padding: 10px;
        background: transparent;
        // color: #BBDEFB;
      }
      input:focus {
        outline: 0;
        // color: #BBDEFB;
      }
      input::placeholder {
        color: #1976d2;
      }
    `
  ]
})
export class SelectorRequisicionesComponent implements OnInit {
  requisiciones: any[];
  gridApi: GridApi;
  proveedor: string;

  gridOptions: GridOptions;
  defaultColDef: ColDef;
  localeText: any;

  constructor(
    public dialogRef: MatDialogRef<SelectorRequisicionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tableService: SxTableService
  ) {
    this.proveedor = data.proveedor;
    this.requisiciones = data.requisiciones;
  }

  ngOnInit() {}

  onSelection(event: any) {
    this.dialogRef.close(event);
  }
}
