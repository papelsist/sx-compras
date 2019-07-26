import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'sx-show-compradets',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 mat-dialog-title>Compras unitarias</h4>
    <div layout layout-align="center center" class="search">
      <input (keyup)="onSearch(box.value)" placeholder="Filtrar" flex #box />
      <button mat-icon-button (click)="exportData()">
        <mat-icon color="primary">file_download</mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="depurar()"
        [disabled]="selected.length === 0"
      ></button>
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
        (selectionChange)="selected = $event"
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
export class ShowCompraDetsComponent implements OnInit {
  partidas: any[];
  selected = [];
  gridApi: GridApi;
  constructor(
    public dialogRef: MatDialogRef<ShowCompraDetsComponent>,
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
        field: 'clave',
        width: 120,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'Suc',
        field: 'sucursalNombre',
        width: 110
      },
      {
        headerName: 'Compra',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Cantidad',
        field: 'solicitado',
        width: 100
      },
      {
        headerName: 'Recibido',
        field: 'recibido',
        width: 100
      },
      {
        headerName: 'Depurado',
        field: 'depurado',
        width: 100
      },
      {
        headerName: 'Pendiente',
        field: 'porRecibir',
        width: 100
      },
      {
        headerName: 'Proveedor',
        field: 'proveedorNombre'
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

  exportData(prefix: string = 'COMPRAS_UNITARIAS') {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  depurar() {
    const ids = this.selected.map(item => item.id);
    console.log('Depurar: ', ids);
  }
}
