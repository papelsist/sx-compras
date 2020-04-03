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
  Inject,
  LOCALE_ID
} from '@angular/core';

import {
  GridOptions,
  GridApi,
  ColDef,
  GridReadyEvent,
  FilterChangedEvent,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  CellEditingStartedEvent
} from 'ag-grid-community';
import { spAgGridText } from 'app/_shared/components/lx-table/table-support';

import { AnalisisDeTransformacionDet } from '../../model';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { Update } from '@ngrx/entity';

import { NumberFormatterComponent } from 'app/_shared/components/number-formatter/number-formatter.component';
import { NumericCellEditorComponent } from 'app/_shared/components/number-cell-editor/number-cell-editor';

@Component({
  selector: 'sx-analisis-trs-partidas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ag-grid-angular
      #agGrid
      class="ag-theme-balham"
      style="width: 100%; height: 100%;"
      [rowData]="partidas"
      [gridOptions]="gridOptions"
      [defaultColDef]="defaultColDef"
      [floatingFilter]="false"
      [localeText]="localeText"
      [stopEditingWhenGridLosesFocus]="true"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
      (modelUpdated)="onModelUpdate($event)"
      [enterMovesDown]="true"
      [enterMovesDownAfterEdit]="true"
      rowSelection="multiple"
      [rowMultiSelectWithClick]="true"
      [frameworkComponents]="frameworkComponents"
    >
    </ag-grid-angular>
  `
})
export class AnalisisTrsPartidasComponent implements OnInit, OnChanges {
  @Input() partidas: AnalisisDeTransformacionDet[] = [];

  gridOptions: GridOptions;
  gridApi: GridApi;
  defaultColDef;

  @Output() select = new EventEmitter();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() update = new EventEmitter<Update<AnalisisDeTransformacionDet>>();

  localeText: any;
  frameworkComponents = {
    numberFormatterComponent: NumberFormatterComponent,
    numericEditorComponent: NumericCellEditorComponent
  };

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(LOCALE_ID) private locale: string,
    private tableService: SxTableService
  ) {
    this.buildGridOptions();
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
      width: 150,
      sortable: true,
      resizable: true
    };
    this.gridOptions.onFilterChanged = this.onFilter.bind(this);
    this.gridOptions.onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
      this.select.emit(event.data);
    };
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
    };
    this.localeText = spAgGridText;
    this.gridOptions.getRowStyle = this.getRowStyles.bind(this);
    this.gridOptions.onCellEditingStopped = event => {
      if (event.column.getColId() === 'cantidad') {
      }
    };
  }

  getRowStyles(params: any) {
    if (params.data.analizado <= 0) {
      return {
        color: 'rgb(231, 61, 61)'
      };
    } else {
      return '';
    }
  }

  onModelUpdate(event) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.actualizarTotales();
  }

  onFirstDataRendered(params) {
    if (this.gridApi) {
      this.actualizarTotales();
    }
  }

  onFilter(event: FilterChangedEvent) {}

  exportData() {
    const params = {
      fileName: `ANALISIS_TRS_${new Date().getTime()}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
  }

  actualizarTotales() {
    let registros = 0;
    let importe = 0;
    this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
      const a: AnalisisDeTransformacionDet = rowNode.data;
      importe += a.importe;
      registros++;
    });
    const res = [
      {
        sucursal: `Reg: ${registros}`,
        importe
      }
    ];
    this.gridApi.setPinnedBottomRowData(res);
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
        headerName: 'Cantidad',
        field: 'cantidad',
        width: 100,
        editable: true,
        // cellEditor: 'numericEditorComponent',
        onCellValueChanged: params => {
          if (params.newValue) {
            const importe = params.data.importe;
            const cantidad = params.newValue;
            const change: Update<AnalisisDeTransformacionDet> = {
              id: params.data.id,
              changes: { cantidad, importe }
            };
            this.update.emit(change);
          }
        }
      },
      {
        headerName: 'Importe',
        field: 'importe',
        width: 100,
        // cellRenderer: 'numberFormatterComponent'
        valueFormatter: params =>
          this.tableService.formatCurrency(params.value),
        editable: true,
        // cellEditor: 'numericEditorComponent',
        onCellValueChanged: params => {
          if (params.newValue) {
            const cantidad = parseFloat(params.data.cantidad);
            const importe = parseFloat(params.newValue);
            const change: Update<AnalisisDeTransformacionDet> = {
              id: params.data.id,
              changes: { cantidad, importe }
            };
            this.update.emit(change);
          }
        }
      },
      {
        headerName: 'Costo U',
        field: 'costo',
        width: 100,
        valueFormatter: params => this.tableService.formatCurrency(params.value)
      },
      {
        headerName: 'Kilos',
        field: 'kilos',
        width: 90
      }
    ];
  }
}
