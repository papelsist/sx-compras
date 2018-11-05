import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter
} from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'sx-cortes-tarjeta-table',
  templateUrl: './cortes-tarjeta-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CortesTarjetaTableComponent implements OnInit {
  columns: ITdDataTableColumn[] = [
    { name: 'folio', label: 'Folio', sortable: true, filter: true, width: 60 },
    {
      name: 'corte',
      label: 'F. Corte',
      width: 120
    },
    {
      name: 'sucursal.nombre',
      label: 'Sucursal',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      name: 'tipo',
      label: 'Tipo',
      sortable: true,
      filter: true,
      width: 210
    },
    {
      name: 'total',
      label: 'Total',
      sortable: true,
      filter: true
    },
    {
      name: 'aplicado',
      label: 'Ingreso',
      filter: true,
      sortable: true
    }
  ];

  @Input() cortes: any[];
  @Output() select = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
