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
import { CuentaPorPagar } from 'app/cxp/model';

@Component({
  selector: 'sx-altp-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 100%">
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham"
        style="width: 100%; height: 100%;"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [floatingFilter]="false"
        [localeText]="localeText"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .pagada {
        font-weight: bold;
      }
    `
  ]
})
export class AltpGridComponent implements OnInit, OnChanges {
  @Input() partidas: CuentaPorPagar[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() print = new EventEmitter();
  @Output() select = new EventEmitter();
  @Output()
  analisis = new EventEmitter();
  @Output()
  pdf = new EventEmitter();
  @Output()
  xml = new EventEmitter();

  @Output()
  totales = new EventEmitter();

  printFriendly = false;

  localeText: any;

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.buildGridOptions();
    this.buildGridStyles();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.gridApi.setRowData(changes.partidas.currentValue);
      }
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
      this.select.emit(event.data);
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
        headerName: 'Nombre',
        field: 'nombre',
        width: 300,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Clave',
        field: 'clave',
        width: 100
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Vencido',
        field: 'saldoVencido',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Tipo',
        field: 'tipo'
      }
    ];
  }
}
