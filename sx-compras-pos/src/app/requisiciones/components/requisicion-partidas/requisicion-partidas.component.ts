import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { LxTableComponent } from 'app/_shared/components';
import { SxTableService } from 'app/_shared/components/lx-table/sx-table.service';

import { ColDef, ModelUpdatedEvent, RowSelectedEvent } from 'ag-grid-community';
import { RequisicionDeMaterialDet } from 'app/requisiciones/models';

@Component({
  selector: 'sx-requisicion-partidas',
  templateUrl: './requisicion-partidas.component.html',
  styleUrls: ['./requisicion-partidas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequisicionPartidasComponent extends LxTableComponent
  implements OnInit, OnChanges {
  @Output() selectionChange = new EventEmitter<
    Partial<RequisicionDeMaterialDet>[]
  >();
  @Output() edit = new EventEmitter<any>();

  frameworkComponents;

  @Input() selectedRows: any[] = [];
  @Output() selectedRowsChange = new EventEmitter();

  constructor(public tableService: SxTableService) {
    super(tableService);
    this.debug = true;
    this.frameworkComponents = {};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.partidas && changes.partidas.currentValue) {
      if (this.gridApi) {
        this.setRowData(changes.partidas.currentValue);
      }
    }
  }

  setRowData(data: any[]) {
    this.gridApi.setRowData(data);
  }

  buildGridOptions() {
    super.buildGridOptions();
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.onRowSelected = (event: RowSelectedEvent) => {
      this.selectionChange.emit(this.gridApi.getSelectedRows());
      this.selectedRowsChange.emit(this.gridApi.getSelectedRows());
    };
    this.gridOptions.enterMovesDown = true;
    this.gridOptions.enterMovesDownAfterEdit = true;
    this.gridOptions.onCellValueChanged = event => {
      this.edit.emit(event.data);
    };
  }

  buildRowStyle(params: any) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
    return {};
  }

  onModelUpdate(event: ModelUpdatedEvent) {
    this.actualizarTotales();
  }

  clearSelection() {
    this.gridApi.deselectAll();
  }

  getAllRows() {
    const data = [];
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const det: Partial<RequisicionDeMaterialDet> = rowNode.data;
        data.push(det);
      });
    }
    return data;
  }

  actualizarTotales() {
    let registros = 0;
    if (this.gridApi) {
      this.gridApi.forEachNodeAfterFilter((rowNode, index) => {
        const det: Partial<RequisicionDeMaterialDet> = rowNode.data;
        registros++;
      });
    }
    const res = [
      {
        producto: `Partidas: ${registros}`
      }
    ];
    if (this.gridApi) {
      this.gridApi.setPinnedBottomRowData(res);
    }
  }

  deleteSelection() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
  }

  buildColsDef(): ColDef[] {
    return [
      {
        headerName: 'Producto',
        field: 'producto',
        width: 115,
        pinned: 'left'
      },
      {
        headerName: 'Descripción',
        field: 'descripcion',
        pinned: 'left',
        width: 300
      },
      {
        headerName: 'Unidad',
        field: 'unidad',
        width: 100,
        maxWidth: 100
      },
      {
        headerName: 'Solicitado',
        field: 'solicitado',
        width: 150,
        maxWidth: 150,
        editable: param => {
          if (param.node.isRowPinned()) {
            return false;
          } else {
            return true;
          }
        }
        // cellEditor: 'numericEditor'
      },
      {
        headerName: 'Comentario',
        field: 'comentario',
        editable: true
      }
    ];
  }
}
