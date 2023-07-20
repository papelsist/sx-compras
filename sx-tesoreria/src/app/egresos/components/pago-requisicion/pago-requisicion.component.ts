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
import * as _ from 'lodash';

@Component({
  selector: 'sx-pago-requisicion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pago-requisicion.component.html'
})
export class PagoRequisicionComponent implements OnInit, OnChanges {
  @Input()
  requisicion: Requisicion;

  @Output()
  cancel = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.requisicion && changes.requisicion.currentValue) {
      // console.log('Requisicion: ', changes.requisicion.currentValue);
    }
  }

  getImporteLocal(req: Requisicion) {
    return req.total * req.tipoDeCambio;
  }
  changeDate(fecha) {
    if (fecha) {
      const fechaFmt = new Date(fecha.substring(0, 10).replace(/-/g, '\/'));
      return fechaFmt;
    }
    return fecha;
  }
}
