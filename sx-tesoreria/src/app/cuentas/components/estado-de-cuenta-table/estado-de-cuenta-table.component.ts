import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Inject,
  LOCALE_ID
} from '@angular/core';
import { formatDate, formatCurrency } from '@angular/common';

import { Movimiento } from '../../models/movimiento';
import {
  GridOptions,
  FilterChangedEvent,
  GridReadyEvent,
  GridApi
} from 'ag-grid-community';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'sx-estado-de-cuenta-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style='height: 100%'>
      <ag-grid-angular #agGrid
        class="ag-theme-balham"
        [ngClass]="{myGrid: !printFriendly, print: printFriendly}"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [enableFilter]="true"
        [enableSorting]="true"
        [floatingFilter]="true"
        [enableColResize]="true"
        [animateRows]="true"
        [paginationAutoPageSize]="true"
        [pagination]="false"
        [localeText]="localeText"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)">
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .myGrid {
        width: 100%;
        height: 100%;
      }
      .print {
        width: '';
        height: '';
      }
    `
  ]
})
export class EstadoDeCuentaTableComponent implements OnInit, OnChanges {
  @Input()
  movimientos: Movimiento[] = [];

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

  @Output()
  totalesChanged = new EventEmitter<{ depositos: number; retiros: number }>();

  printFriendly = false;

  @Output()
  print = new EventEmitter();

  @Output()
  printAsEstadoDeCuenta = new EventEmitter();

  localeText;

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.buildColsDef();
    this.defaultColDef = {
      width: 100,
      editable: false,
      filter: 'agTextColumnFilter'
    };

    this.gridOptions.onFilterChanged = this.onFilter;
    this.buildLocalText();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.movimientos && changes.movimientos.currentValue) {
      if (this.gridApi) {
        this.gridApi.setRowData(changes.movimientos.currentValue);
      }
    }
  }

  onModelUpdate(event) {
    this.actualizarTotales();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.movimientos);
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onFilter(event: FilterChangedEvent) {}

  actualizarTotales() {
    if (this.gridApi) {
      let depositos = 0.0;
      let retiros = 0.0;
      this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
        depositos += rowNode.data.deposito;
        retiros += rowNode.data.retiro;
      });
      this.totalesChanged.emit({ depositos, retiros });
    }
  }

  printGrid() {
    const data = [];
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
      data.push(rowNode.data);
    });
    this.print.emit(data);
  }

  printEstadoDeCuenta() {
    const data = [];
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
      data.push(rowNode.data);
    });
    this.printAsEstadoDeCuenta.emit(data);
  }

  private buildColsDef() {
    return [
      {
        headerName: 'Fecha',
        field: 'fecha',
        width: 90,
        cellRenderer: params => this.transformDate(params.value)
      },
      {
        headerName: 'Concepto',
        field: 'concepto',
        width: 90
      },
      {
        headerName: 'F.Pago',
        field: 'formaDePago',
        width: 90
      },
      {
        headerName: 'Concepto R',
        field: 'conceptoReporte',
        width: 150
      },
      {
        headerName: 'Depósito',
        field: 'deposito',
        width: 80,
        filter: 'agNumberColumnFilter',
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Retiro',
        field: 'retiro',
        width: 80,
        filter: 'agNumberColumnFilter',
        cellRenderer: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'T.C.',
        field: 'tipoDeCambio',
        width: 50
      },
      {
        headerName: 'Tipo',
        field: 'tipo',
        width: 80
      },
      {
        headerName: 'Referencia',
        field: 'referencia',
        width: 80
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        width: 170
      },
      {
        headerName: 'Sucursal',
        field: 'sucursal',
        width: 60
      },
      {
        headerName: 'x Ident',
        field: 'porIdentificar',
        width: 50
      },
      {
        headerName: 'CTar',
        field: 'orden',
        width: 50
      },
      {
        headerName: 'Creado',
        field: 'dateCreated',
        width: 60
      },
      {
        headerName: 'F. Dep',
        field: 'fechaDeposito',
        cellRenderer: params => this.transformDate(params.value),
        width: 90
      }
    ];
  }

  transformDate(date) {
    if (date !== undefined && date !== null) {
      return formatDate(date, 'dd/MM/yyyy', this.locale);
    } else {
      return '';
    }
  }
  transformCurrency(data) {
    return formatCurrency(data, this.locale, '');
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
}
