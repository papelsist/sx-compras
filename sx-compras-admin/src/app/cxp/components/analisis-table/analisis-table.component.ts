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
import { Analisis } from 'app/cxp/model';
import { PrintCellRendererComponent } from 'app/_shared/components';

@Component({
  selector: 'sx-analisis-table',
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
        [frameworkComponents]="frameworkComponents"
      >
      </ag-grid-angular>
    </div>
  `,
  // styleUrls: ['./requisiciones-table.component.scss']
  styles: [
    `
      .pagada {
        font-weight: bold;
      }
    `
  ]
})
export class AnalisisTableComponent implements OnInit, OnChanges {
  @Input() partidas: Analisis[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() print = new EventEmitter();
  @Output() select = new EventEmitter();

  @Output()
  totales = new EventEmitter();

  printFriendly = false;

  localeText: any;

  public frameworkComponents;

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.buildGridOptions();
    this.buildGridStyles();
    this.frameworkComponents = {
      printRenderer: PrintCellRendererComponent
    };
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
        // this.print.emit(event.data);
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
      fileName: `ANALISIS_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  actualizarTotales() {
    if (this.gridApi) {
      let rows = 0;
      let importe = 0.0;
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        importe += rowNode.data.importe;
        rows++;
      });
      this.totales.emit({ rows, importe });
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
        headerName: 'Folio',
        field: 'folio',
        pinned: 'left',
        width: 110
      },
      {
        headerName: 'Nombre',
        field: 'nombre',
        width: 300,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 110,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'F.Entrada',
        field: 'fechaEntrada',
        width: 110,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Factura',
        field: 'facturaInfo',
        width: 150
      },

      {
        headerName: 'Fac Fecha',
        field: 'facturaFecha',
        width: 110,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Mon',
        field: 'factura',
        colId: 'moneda',
        width: 70,
        cellRenderer: params => params.value.moneda
      },
      {
        headerName: 'Importe',
        field: 'importe',
        width: 130,
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Cerrada',
        field: 'cerrado',
        width: 150,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Actualizó',
        field: 'updateUser',
        width: 110
      },
      {
        headerName: 'Modificado',
        field: 'modificado',
        maxWidth: 150,
        cellRenderer: params =>
          this.transformDate(params.value, 'dd/MM/yyyy HH:mm')
      },
      {
        headerName: 'Comentario',
        field: 'comentario'
      },
      /*
      {
        headerName: 'P',
        field: 'id',
        colId: 'print',
        cellRenderer: params => 'P',
        filter: false,
        width: 50
      },
      */
      {
        headerName: 'P',
        colId: 'print',
        cellRenderer: 'printRenderer',
        onCellClicked: params => this.print.emit(params.data),
        width: 90
      }
    ];
  }

  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
