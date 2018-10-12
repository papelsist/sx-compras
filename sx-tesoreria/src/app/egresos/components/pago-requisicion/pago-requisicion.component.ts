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
}
