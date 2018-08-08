import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { Analisis } from '../../model/analisis';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'sx-analisis-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analisis-table.component.html',
  styleUrls: ['./analisis-table.component.scss']
})
export class AnalisisTableComponent implements OnInit, OnChanges {
  @Input() analisis: Analisis[] = [];
  @Input() searchTerm: string;
  @Output() edit = new EventEmitter();
  @Output() select = new EventEmitter();
  dataSource = new MatTableDataSource<Analisis>([]);
  displayColumns = [
    'folio',
    'proveedor',
    'fecha',
    'fechaEntrada',
    'factura',
    'importe',
    'moneda',
    // 'uuid',
    'cerrado',
    'updateUser',
    'operaciones'
  ]; // , 'serie', 'folio', 'total'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit() {
    // this.setFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private setFilter() {
    this.dataSource.filterPredicate = (data: Analisis, filter: string) => {
      const props = ['folio', 'nombre'];
      return (
        data.factura.folio.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      );
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.analisis && changes.analisis.currentValue) {
      this.dataSource.data = changes.analisis.currentValue;
    }
    if (changes.searchTerm && changes.searchTerm.currentValue) {
      this.dataSource.filter = changes.searchTerm.currentValue;
    }
  }

  toogleSelect(event: Analisis) {
    event.selected = !event.selected;
    const data = this.analisis.filter(item => item.selected);
    this.select.emit([...data]);
  }

  onEdit($event: Event, row) {
    $event.preventDefault();
    this.edit.emit(row);
  }
}
