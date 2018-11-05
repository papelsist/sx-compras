import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITdDataTableColumn } from '@covalent/core';

@Component({
  selector: 'sx-corte-tarjeta-form',
  templateUrl: './corte-tarjeta-form.component.html'
})
export class CorteTarjetaFormComponent implements OnInit {
  @Input() corte: any;
  @Output() aplicar = new EventEmitter();
  @Output() cancelar = new EventEmitter();
  @Output() eliminar = new EventEmitter();
  @Output() cancelarAplicacion = new EventEmitter();

  columns: ITdDataTableColumn[] = [
    { name: 'tipo', label: 'Tipo', width: 270 },
    { name: 'importe', label: 'Importe' }
  ];

  constructor() {}

  ngOnInit() {}
}
