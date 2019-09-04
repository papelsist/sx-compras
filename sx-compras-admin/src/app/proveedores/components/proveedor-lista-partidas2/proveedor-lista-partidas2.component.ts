import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ListaDePreciosProveedorDet } from '../../models/listaDePreciosProveedorDet';
import { aplicarDescuentosEnCascada } from 'app/utils/money-utils';
import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';
import { ColDef, RowSelectedEvent } from 'ag-grid-community';

@Component({
  selector: 'sx-proveedor-lista-partidas2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 100%">
      <ag-grid-angular
        #agGrid
        class="ag-theme-balham"
        style="width: 100%; height: 100%;"
        [gridOptions]="gridOptions"
        [defaultColDef]="defaultColDef"
        [floatingFilter]="true"
        [localeText]="localeText"
        (firstDataRendered)="onFirstDataRendered($event)"
        (gridReady)="onGridReady($event)"
        (modelUpdated)="onModelUpdate($event)"
      >
      </ag-grid-angular>
    </div>
  `
})
export class ProveedorListaPartidas2Component extends LxTableComponent
  implements OnInit, OnChanges {
  @Input() parent: FormGroup;
  @Input() readOnly = false;
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() deleteRow = new EventEmitter();
  @Output() selectionChange = new EventEmitter<any[]>();

  constructor(public tableService: SxTableService) {
    super(tableService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.setRowData(changes.partidas.currentValue);
      }
    }
  }

  ngOnInit() {}

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
    };
    this.gridOptions.onCellValueChanged = params => {
      const row: ListaDePreciosProveedorDet = params.data;
      if (params.column.getColId() === 'precio') {
        row.precioBruto = parseFloat(params.value);
      }
      this.actualizar(row);
    };
  }

  asignarPrecio(precio, row: ListaDePreciosProveedorDet) {
    row.precioBruto = parseFloat(precio);
    this.actualizar(row);
  }

  actualizar(row: ListaDePreciosProveedorDet) {
    const { unidad, precioBruto, desc1, desc2, desc3, desc4 } = row;
    const importeNeto = aplicarDescuentosEnCascada(precioBruto, [
      desc1,
      desc2,
      desc3,
      desc4
    ]);
    row.precioNeto = importeNeto;
    this.gridApi.redrawRows();
    this.update.emit(row);
  }

  getDifererencia(row: ListaDePreciosProveedorDet) {
    if (row.precioBruto <= 0) {
      return 0;
    }
    const dif = row.precioBruto - row.precioAnterior;
    return dif / row.precioBruto;
  }

  deleteSelection() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
    this.deleteRow.emit();
  }

  getAllRows() {
    const data = [];
    if (this.gridApi) {
      this.gridApi.forEachNode((rowNode, index) => {
        const det: Partial<ListaDePreciosProveedorDet> = rowNode.data;
        data.push(det);
      });
    }
    return data;
  }

  getAllRowsOld() {
    const data = [];
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const det: Partial<ListaDePreciosProveedorDet> = rowNode.data;
        data.push(det);
      });
    }
    return data;
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Clave',
        field: 'clave',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        width: 250,
        pinned: 'left'
      },
      {
        headerName: 'Unidad',
        field: 'unidad',
        width: 90
      },
      {
        headerName: 'P. Anterior',
        field: 'precioAnterior',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value)
      },
      {
        headerName: 'Precio',
        field: 'precioBruto',
        width: 110,
        valueFormatter: params => this.transformCurrency(params.value),
        // valueSetter: params => this.asignarPrecio(params.data);
        editable: true
      },
      {
        headerName: 'Diferencia',
        valueGetter: params => this.getDifererencia(params.data),
        valueFormatter: params => this.transformPercent(params.value)
      },
      {
        headerName: 'Desc 1',
        field: 'desc1',
        width: 100,
        editable: true
      },
      {
        headerName: 'Desc 2',
        field: 'desc2',
        width: 100,
        editable: true
      },
      {
        headerName: 'Desc 3',
        field: 'desc3',
        width: 100,
        editable: true
      },
      {
        headerName: 'Desc 4',
        field: 'desc4',
        width: 100,
        editable: true
      },
      {
        headerName: 'P Neto',
        field: 'precioNeto',
        valueFormatter: params => this.transformCurrency(params.value),
        width: 110
      }
    ];
  }
}
