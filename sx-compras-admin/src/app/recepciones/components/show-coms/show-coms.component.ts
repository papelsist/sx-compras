import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'sx-show-coms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 mat-dialog-title>Entradas unitarias por compra (COM)</h4>
    <div layout layout-align="center center" class="search">
      <input (keyup)="onSearch(box.value)" placeholder="Filtrar" flex #box />
      <button mat-icon-button (click)="exportData()">
        <mat-icon color="primary">file_download</mat-icon>
      </button>
    </div>
    <div class="grid-panel">
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham"
        style="width: 100%; height: 100%;"
        [columnDefs]="columns"
        [floatingFilter]="false"
        [rowData]="partidas"
        [defaultColDef]="defaultColDef"
        (gridReady)="onGridReady($event)"
      >
      </ag-grid-angular>
    </div>
    <mat-dialog-content> </mat-dialog-content>
  `,
  styles: [
    `
      .search {
        margin-top: -15px;
        margin-bottom: 5px;
        height: 20px;
      }
      .grid-panel {
        height: 450px;
        width: 100%;
        overflow: auto;
      }
    `
  ]
})
export class ShowComsComponent implements OnInit {
  partidas: any[];
  gridApi: GridApi;
  constructor(
    public dialogRef: MatDialogRef<ShowComsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.partidas = data.partidas || [];
  }

  ngOnInit() {}

  onSearch(event) {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(event);
    }
  }

  close() {
    this.dialogRef.close();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  get columns(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        valueGetter: params => {
          return params.data.producto.clave;
        },
        width: 120,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        valueGetter: params => {
          return params.data.producto.descripcion;
        },
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'Suc',
        field: 'sucursal',
        width: 110
      },
      {
        headerName: 'Compra',
        field: 'compraFolio',
        width: 110
      },
      {
        headerName: 'COM',
        field: 'com',
        width: 110
      },
      {
        headerName: 'Cantidad',
        field: 'cantidad',
        width: 120
      },
      {
        headerName: 'Proveedor',
        field: 'proveedor'
      }
    ];
  }

  get defaultColDef(): ColDef {
    return {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
  }

  exportData(prefix: string = 'COMS') {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }
}
