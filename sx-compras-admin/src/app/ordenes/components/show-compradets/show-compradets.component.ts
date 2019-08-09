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
  CellClickedEvent,
  GridOptions
} from 'ag-grid-community';
import { ComprasService } from 'app/ordenes/services';

import { finalize } from 'rxjs/operators';
import { TdDialogService } from '@covalent/core';

import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

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
      >
        <mat-icon>layers_clear</mat-icon>
      </button>
    </div>
    <div class="grid-panel">
      <ng-template
        tdLoading
        [tdLoadingUntil]="!loading"
        tdLoadingStrategy="overlay"
      >
      </ng-template>
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham"
        style="width: 100%; height: 100%;"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [floatingFilter]="true"
        (gridReady)="onGridReady($event)"
        rowSelection="multiple"
        [rowMultiSelectWithClick]="true"
        [isRowSelectable]="isRowSelectable"
        [localeText]="localeText"
        (selectionChanged)="onSelection($event)"
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
  loading = false;
  isRowSelectable;

  gridOptions: GridOptions;
  defaultColDef: ColDef;
  localeText: any;

  constructor(
    public dialogRef: MatDialogRef<ShowCompraDetsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ComprasService,
    private dialogService: TdDialogService,
    public tableService: SxTableService
  ) {
    this.partidas = [...data.partidas] || [];
    this.isRowSelectable = function(node) {
      return node.data ? node.data.pendiente !== 0.0 : false;
    };
    this.buildGridOptions();
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.gridOptions.onCellClicked = this.onCellClicked.bind(this);
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
    this.localeText = spAgGridText;
  }

  ngOnInit() {}

  onSearch(event) {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(event);
    }
  }

  close() {
    // this.dialogRef.close();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.partidas);
  }

  onCellClicked(event: CellClickedEvent) {}

  onSelection(event: any) {
    this.selected = this.gridApi.getSelectedRows();
  }
  exportData(prefix: string = 'COMPRAS_UNITARIAS') {
    const params = {
      fileName: `${prefix}_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  depurar() {
    const partidas = this.selected.map(item => item.id);
    this.dialogService
      .openConfirm({
        title: 'DEPURACION BATCH',
        message: `DEPURAR ${partidas.length} PARTIDAS`,
        acceptButton: 'DEPURAR',
        cancelButton: 'CANCELAR'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.loading = true;
          this.service
            .depuraracionBatch(partidas)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe(
              (data: any[]) => {
                data.forEach(item => {
                  const found = this.gridApi
                    .getSelectedNodes()
                    .find(node => node.data.id === item.id);
                  if (found) {
                    found.setData(item);
                  }
                });
              },
              error => console.error('Depuracion error: ', error)
            );
        }
      });
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'clave',
        width: 120,
        pinned: 'left',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: false
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
        filter: 'agNumberColumnFilter',
        width: 100
      },
      {
        headerName: 'Proveedor',
        field: 'proveedorNombre'
      }
    ];
  }
}
