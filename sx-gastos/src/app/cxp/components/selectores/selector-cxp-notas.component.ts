import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CuentaPorPagar } from '../../model/cuentaPorPagar';

import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';

import { ConfigService } from 'app/utils/config.service';
import { NotaDeCreditoCxP } from 'app/cxp/model';
import { Proveedor } from 'app/proveedores/models/proveedor';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

@Component({
  selector: 'sx-selector-cxp-notas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span mat-dialog-title>Notas disponibles: {{proveedor.nombre}} </span>
    <mat-divider></mat-divider>
    <mat-card-content>
      <div class="notas-grid">
        <ag-grid-angular
          #agGrid
          class="ag-theme-balham"
          style="width: 100%; height: 100%;"
          [rowData]="notas"
          [columnDefs]="columns"
          [defaultColDef]="defaultColDef"
          rowSelection="single"
          [gridOptions]="gridOptions"
          [localeText]="localeText"
          [floatingFilter]="true"
          (gridReady)="onGridReady($event)"
          (rowDoubleClicked)="onRowDoubleClicked($event)">
        </ag-grid-angular>
      </div>
    </mat-card-content>
    <!--
    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="button">Cancelar</button>
      <button mat-button [mat-dialog-close]="selected" [disabled]="!selected" type="button">Seleccionar</button>
    </mat-dialog-actions>
    -->
  `,
  styles: [
    `
      .notas-grid {
        height: 400px;
        overflow: auto;
      }
    `
  ]
})
export class SelectorCxpNotasComponent implements OnInit {
  notas: any[] = [];
  selected: NotaDeCreditoCxP;
  proveedor: Partial<Proveedor>;

  columns: ColDef[] = [];
  gridApi: GridApi;
  gridOptions: GridOptions;
  defaultColDef: ColDef;
  localeText: any;

  url: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private config: ConfigService,
    public tableService: SxTableService,
    public dialogRef: MatDialogRef<SelectorCxpNotasComponent>
  ) {
    this.url = config.buildApiUrl('rembolsos/notasPendientes');
    this.proveedor = data.proveedor;
    this.buildGrid();
  }

  ngOnInit() {
    const params = new HttpParams().set('proveedorId', this.proveedor.id);
    this.http.get<any[]>(this.url, { params }).subscribe(res => {
      this.notas = res;
      if (this.gridApi) {
        this.gridApi.setRowData(this.notas);
      }
      // this.gridApi.setRowData(this.notas);
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  buildGrid() {
    this.gridOptions = <GridOptions>{};
    this.localeText = spAgGridText;
    this.columns = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: true
    };
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent) {
    if (!event.node.isRowPinned()) {
      this.dialogRef.close(event.data);
    }
  }

  onSelection(event: NotaDeCreditoCxP) {
    this.selected = event;
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 300,
        pinned: 'left',
        hide: true
      },
      {
        headerName: 'Serie',
        field: 'serie',
        width: 80,
        pinned: 'left'
      },
      {
        headerName: 'Folio',
        field: 'folio',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 80
      },
      {
        headerName: 'Sub Tot',
        field: 'subTotal',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        width: 110,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'UUID',
        field: 'uuid',
        width: 100,
        valueGetter: params => params.data.uuid.substr(-12, 12)
      }
    ];
  }
}
