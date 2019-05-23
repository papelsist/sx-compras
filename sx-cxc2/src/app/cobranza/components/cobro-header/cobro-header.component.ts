import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { Cobro } from 'app/cobranza/models';
import { PagosUtils } from 'app/_core/services/pagos-utils.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sx-cobro-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cobro-header.component.html',
  styleUrls: ['./cobro-header.component.scss']
})
export class CobroHeaderComponent implements OnInit {
  @Input()
  cobro: Cobro;

  form: FormGroup;

  constructor(private pagoUtils: PagosUtils) {}

  ngOnInit() {
    // console.log('Cobro: ', this.cobro);
  }

  get formaDePago() {
    return this.pagoUtils.slim(this.cobro.formaDePago);
  }
}
