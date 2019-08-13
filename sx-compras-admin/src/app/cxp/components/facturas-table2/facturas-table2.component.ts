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
  selector: 'sx-facturas-table2',
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
export class FacturasTable2Component implements OnInit, OnChanges {
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
    this.gridOptions.onCellClicked = (event: CellClickedEvent) => {
      if (event.column.getId() === 'print') {
        this.print.emit(event.data);
      }
    };
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

  onModelUpdate(event) {
    this.actualizarTotales();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.partidas);
  }

  onFirstDataRendered(params) {}

  onFilter(event: FilterChangedEvent) {}

  printGrid() {
    this.gridApi.setDomLayout('print');
    this.printFriendly = true;
    this.cd.detectChanges();
    setTimeout(() => {
      print();
      this.gridApi.setDomLayout(null);
      this.printFriendly = false;
      this.cd.detectChanges();
    }, 8000);
  }

  exportData() {
    const params = {
      fileName: `FACTURAS_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  actualizarTotales() {
    if (this.gridApi) {
      let rows = 0;
      let total = 0.0;
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        total += rowNode.data.total;
        rows++;
      });
      this.totales.emit({ rows, total });
    }
  }

  transformCurrency(data) {
    return formatCurrency(data, this.locale, '$');
  }

  transformDate(data, format: string = 'dd/MM/yyyy') {
    if (data) {
      return formatDate(data, format, this.locale);
    } else {
      return '';
    }
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
        headerName: 'Serie',
        field: 'serie',
        width: 100
      },
      {
        headerName: 'Factura',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Vto',
        field: 'vencimiento',
        width: 100,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'moneda',
        width: 70
      },
      {
        headerName: 'TC',
        field: 'tipoDeCambio',
        maxWidth: 60,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'TC Cont',
        field: 'tcContable',
        maxWidth: 60,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Saldo',
        field: 'saldo',
        maxWidth: 110,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Pagos',
        field: 'pagos',
        maxWidth: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Notas',
        field: 'compensaciones',
        maxWidth: 100,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Atraso',
        field: 'atraso',
        maxWidth: 50
      },
      {
        headerName: 'Actualizó',
        field: 'updateUser',
        width: 110
      },
      {
        headerName: 'Modificado',
        field: 'lastUpdated',
        maxWidth: 150,
        cellRenderer: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      },
      {
        headerName: 'Tipo',
        field: 'tipo'
      }
    ];
  }
}
