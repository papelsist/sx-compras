import { Component, OnInit, Inject } from '@angular/core';
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
  selector: 'sx-selector-de-trs',
  templateUrl: './selector-de-trs.component.html',
  styleUrls: ['./selector-de-trs.component.scss']
})
export class SelectorDeTrsComponent implements OnInit {
  trs: any[];
  selected: any[];
  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;
  localeText: any;

  constructor(
    public dialogRef: MatDialogRef<SelectorDeTrsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tableService: SxTableService
  ) {
    this.trs = data.trs || [];
    this.selected = [];
    this.buildGridOptions();
  }

  ngOnInit() {
    // console.log('DECS: ', this.trs);
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
        width: 100,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Fecha.',
        field: 'trsFecha',
        width: 100,
        valueFormatter: params => this.tableService.formatDate(params.value)
      },
      {
        headerName: 'TRS',
        field: 'trsFolio',
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
        maxWidth: 100
      }
    ];
  }
}
