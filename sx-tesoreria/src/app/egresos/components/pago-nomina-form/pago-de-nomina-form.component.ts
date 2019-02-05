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

import { PagoDeNomina } from '../../models';
import * as _ from 'lodash';

@Component({
  selector: 'sx-pago-nomina-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pago-de-nomina-form.component.html'
})
export class PagoDeNominaFormComponent implements OnInit, OnChanges {
  @Input()
  pagoNomina: PagoDeNomina;

  @Output()
  cancel = new EventEmitter();

  total: number;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pagoNomina && changes.pagoNomina.currentValue) {
      // console.log('Pago: ', changes.pagoNomina.currentValue);
      // this.pagoNomina.total
      this.total = changes.pagoNomina.currentValue.total;
    }
  }
}
