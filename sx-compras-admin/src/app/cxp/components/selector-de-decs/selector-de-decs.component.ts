import {
  Component,
  OnInit,
  Inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  GridOptions,
  GridApi,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  ColDef,
  GridReadyEvent
} from 'ag-grid-community';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

@Component({
  selector: 'sx-selector-de-decs',
  templateUrl: './selector-de-decs.component.html',
  styleUrls: ['./selector-de-decs.component.scss']
})
export class SelectorDeDecsComponent implements OnInit {
  decs: any[];
  selected: any[];
  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;
  localeText: any;

  constructor(
    public dialogRef: MatDialogRef<SelectorDeDecsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tableService: SxTableService
  ) {
    this.decs = data.decs || [];
    this.selected = [];
    this.buildGridOptions();
  }

  ngOnInit() {
    // console.log('DECS: ', this.decs);
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true,
      resizable: true
    };
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selected = this.gridApi.getSelectedRows();
      this.actualizarTotales();
    };
    this.gridOptions.onRowDoubleClicked = (event: RowDoubleClickedEvent) => {};
    this.gridOptions.onModelUpdated = this.onModelUpdate.bind(this);
    this.localeText = spAgGridText;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.actualizarTotales();
  }

  onModelUpdate(event) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  actualizarTotales() {
    let registros = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      registros++;
    });
    const res = [
      {
        sucursal: `Reg: ${registros}`,
        cantidad: `Sel: ${this.selected.length}`
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
  }

  close() {
    this.dialogRef.close();
  }

  doSubmit() {
    if (this.selected.length > 0) {
      this.dialogRef.close(this.selected);
    }
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 90,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'DEC',
        field: 'decFolio',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Producto',
        field: 'clave',
        width: 110,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'cantidad',
        field: 'cantidad',
        maxWidth: 110
      },
      {
        headerName: 'Fecha.',
        field: 'decFecha',
        width: 100,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'Referencia',
        field: 'referencia',
        width: 110
      },
      {
        headerName: 'Proveedor',
        field: 'proveedor'
      }
    ];
  }
}
