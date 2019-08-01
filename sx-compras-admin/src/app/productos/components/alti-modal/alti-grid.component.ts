import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Inject,
  LOCALE_ID,
  ChangeDetectorRef
} from '@angular/core';
import { formatCurrency, formatNumber, formatDate } from '@angular/common';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  FilterChangedEvent,
  CellClickedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

import { Producto } from 'app/productos/models/producto';

@Component({
  selector: 'sx-alti-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-balham"
      style="width: 100%; height: 100%;"
      [gridOptions]="gridOptions"
      [rowData]="partidas"
      [rowSelection]="rowSelection"
      [rowMultiSelectWithClick]="true"
      [defaultColDef]="defaultColDef"
      [floatingFilter]="false"
      [localeText]="localeText"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdate($event)"
      (selectionChanged)="onSelection($event)"
    >
    </ag-grid-angular>
  `,
  styles: [
    `
      .pagada {
        font-weight: bold;
      }
    `
  ]
})
export class AltiGridComponent implements OnInit, OnChanges {
  @Input() partidas: Producto[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() select = new EventEmitter();
  @Input() rowSelection = 'multiple';

  @Output()
  totales = new EventEmitter();
  localeText: any;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.buildGridOptions();
    this.buildGridStyles();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
    }
  }

  buildGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      editable: false,
      filter: 'agTextColumnFilter',
      width: 150,
      sortable: true
    };
    this.gridOptions.onFilterChanged = this.onFilter.bind(this);
    this.gridOptions.onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
      // this.select.emit(this.gridApi.getSelectedRows());
    };
    this.localeText = spAgGridText;
  }

  buildGridStyles() {
    this.gridOptions.getRowStyle = this.getGridClass.bind(this);
  }

  getGridClass(params: any) {
    if (params.data.pagada) {
      return {
        color: 'rgb(231, 61, 61)'
      };
    } else {
      return '';
    }
  }

  onSelection(event: any) {
    this.select.emit(this.gridApi.getSelectedRows());
  }

  onModelUpdate(event) {}

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.partidas);
  }

  onFirstDataRendered(params) {}

  onFilter(event: FilterChangedEvent) {}

  transformCurrency(data) {
    return formatCurrency(data, this.locale, '$');
  }

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clae',
        field: 'clave',
        width: 110,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 300,
        pinned: 'left'
      },
      {
        headerName: 'Linea',
        field: 'linea',
        width: 130
      },
      {
        headerName: 'Clase',
        field: 'clase',
        width: 130
      },
      {
        headerName: 'Marca',
        field: 'marca',
        width: 130
      }
    ];
  }
}
