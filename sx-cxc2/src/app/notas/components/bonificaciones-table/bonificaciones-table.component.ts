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
import { NotaDeCredito } from 'app/cobranza/models';
import { PagosUtils } from 'app/_core/services/pagos-utils.service';


@Component({
  selector: 'sx-bonificaciones-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bonificaciones-table.component.html',
  styleUrls: ['./bonificaciones-table.component.scss']
})
export class BonificacionesTableComponent implements OnInit, OnChanges {
  @Input()
  notas: NotaDeCredito[] = [];
  @Input()
  filter: string;
  dataSource = new MatTableDataSource<NotaDeCredito>([]);

  displayColumns = [
    'tipo',
    'fecha',
    'serie',
    'folio',
    'nombre',
    'formaDePago',
    'moneda',
    'importe',
    'aplicado',
    'disponible',
    'comentario',
    'updateUser',
    'lastUpdated',
    'operaciones'
  ];

  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @Output()
  edit = new EventEmitter();

  @Output()
  select = new EventEmitter();

  @Output()
  delete = new EventEmitter();

  constructor(private utils: PagosUtils) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.notas && changes.notas.currentValue) {
      this.dataSource.data = changes.notas.currentValue;
    }
    if (changes.filter) {
      const s = changes.filter.currentValue || '';
      this.dataSource.filter = s.toLowerCase();
    }
  }

  getForma(row: NotaDeCredito) {
    return this.utils.slim(row.formaDePago);
  }

  doDelete(event: Event, row: NotaDeCredito) {
    event.stopPropagation();
    this.delete.emit(row);
  }

  doSelect(event: Event, row: NotaDeCredito) {
    event.stopPropagation();
    this.select.emit(row);
  }
}
