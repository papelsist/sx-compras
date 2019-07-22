import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  LOCALE_ID,
  Inject
} from '@angular/core';
import { formatCurrency, formatNumber } from '@angular/common';

import {
  GridOptions,
  FilterChangedEvent,
  GridReadyEvent,
  GridApi,
  ColDef,
  CellClickedEvent,
  RowDoubleClickedEvent
} from 'ag-grid-community';
import { ComprobanteFiscal } from 'app/cxp/model';

@Component({
  selector: 'sx-cfdis-table2',
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
  styleUrls: ['./cfdis-table2.component.scss']
})
export class CfdisTable2Component implements OnInit, OnChanges {
  @Input()
  partidas: ComprobanteFiscal[] = [];

  @Input()
  filter: string;

  @Input()
  selected: number;

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output()
  select = new EventEmitter();

  @Output()
  edit = new EventEmitter();
  @Output() xml = new EventEmitter();
  @Output() pdf = new EventEmitter();

  @Output()
  totales = new EventEmitter();

  printFriendly = false;

  localeText;

  pinnedBottomRowData;
  frameworkComponents;

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string
  ) {
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
      if (event.column.getId() === 'pdf') {
        this.pdf.emit(event.data);
      }
      if (event.column.getId() === 'xml') {
        this.xml.emit(event.data);
      }
    };
    this.gridOptions.onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
      this.select.emit(event.data);
    };
    this.buildLocalText();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.gridApi.setRowData(changes.partidas.currentValue);
      }
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
      fileName: `CFDIS_${new Date().getTime()}.csv`
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

  private buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Emisor',
        field: 'emisorNombre',
        width: 300,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Serie',
        field: 'serie',
        width: 110
      },
      {
        headerName: 'Folio',
        field: 'folio',
        width: 110
      },
      {
        headerName: 'Moneda',
        field: 'moneda',
        width: 70
      },
      {
        headerName: 'T.C.',
        field: 'tipoDeCambio',
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Total',
        field: 'total',
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'M.P',
        field: 'metodoDePago',
        width: 100
      },
      {
        headerName: 'F.P',
        field: 'formaDePago',
        width: 100
      },
      {
        headerName: 'Uso',
        field: 'usoCfdi',
        width: 100
      },
      {
        headerName: 'UUID',
        field: 'uuid',
        cellRenderer: params => params.value.substring(0, 5)
      },
      {
        headerName: 'TipCom',
        field: 'tipoDeComprobante',
        width: 90
      },
      {
        headerName: 'Versión',
        field: 'versionCfdi',
        width: 90
      },
      {
        headerName: 'XML',
        field: 'id',
        colId: 'xml',
        cellRenderer: params => 'XML',
        filter: false,
        width: 50
      },
      {
        headerName: 'PDF',
        field: 'id',
        colId: 'pdf',
        cellRenderer: params => 'PDF',
        filter: false,
        width: 50
      }
    ];
  }

  buildLocalText() {
    this.localeText = {
      page: 'página',
      more: 'mas',
      to: 'a',
      of: 'de',
      next: 'siguiente',
      last: 'ultimo',
      first: 'primero',
      previous: 'anterior',
      loadingOoo: 'cargando...',
      applyFilter: 'Aplicar...',
      equals: 'igual',
      notEqual: 'diferente a',
      lessThan: 'menor que',
      greaterThan: 'mayor que',
      lessThanOrEqual: 'menor o igual',
      greaterThanOrEqual: 'mayor o igual',
      inRange: 'rango',
      contains: 'contiene',
      notContains: 'no contiene',
      startsWith: 'inicia con',
      endsWith: 'termina con',
      filters: 'filtros'
    };
  }

  transformCurrency(data) {
    return formatCurrency(data, this.locale, '$');
    // return formatNumber(data, this.locale, '');
  }
}
