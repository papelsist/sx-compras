import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Requisicion } from '../../models';

@Component({
  selector: 'sx-requisicion-pago',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './requisicion-pago.component.html'
})
export class RequisicionPagoComponent implements OnInit, OnChanges {
  @Input()
  requisicion: Requisicion;

  @Output()
  pagar = new EventEmitter();

  @Output()
  cancel = new EventEmitter();

  @Output()
  poliza = new EventEmitter();

  @Output()
  cancelarPago = new EventEmitter();

  @Output()
  cancelarCheque = new EventEmitter();

  @Output()
  generarCheque = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requisicion && changes.requisicion.currentValue) {
      console.log('Requisicion: ', changes.requisicion.currentValue);
    }
  }
}
