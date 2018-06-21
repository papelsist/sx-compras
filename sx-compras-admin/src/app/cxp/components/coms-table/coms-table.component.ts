import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RecepcionDeCompra } from '../../model/recepcionDeCompra';

@Component({
  selector: 'sx-coms-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coms-table.component.html',
  styleUrls: ['./coms-table.component.scss']
})
export class ComsTableComponent implements OnInit, OnChanges {
  @Input() coms: RecepcionDeCompra[] = [];
  @Input() multipleSelection = true;
  dataSource = new MatTableDataSource<RecepcionDeCompra>([]);

  displayColumns = [
    'sucursal',
    'documento',
    'fecha',
    'remision',
    'fechaRemision',
    'pendiente'
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() select = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.coms && changes.coms.currentValue) {
      this.dataSource.data = changes.coms.currentValue;
    }
  }

  toogleSelect(event: RecepcionDeCompra) {
    if (this.multipleSelection) {
      event.selected = !event.selected;
      const data = this.coms.filter(item => item.selected);
      this.select.emit([...data]);
    } else {
      event.selected = !event.selected;
      this.coms.forEach(item => {
        if (item.id !== event.id) {
          item.selected = false;
        }
      });
      this.select.emit([event]);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
