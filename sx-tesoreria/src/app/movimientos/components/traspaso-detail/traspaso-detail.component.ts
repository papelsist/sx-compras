import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Traspaso } from 'app/movimientos/models/traspaso';

@Component({
  selector: 'sx-traspaso-detail',
  template: `
    <div >
      <mat-divider></mat-divider>
      <sx-movimientos-cuenta-table [movimientos]="traspaso?.movimientos"></sx-movimientos-cuenta-table>
    </div>
  `
})
export class TraspasoDetailComponent implements OnInit, OnChanges {
  @Input()
  traspaso: Traspaso;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.traspaso && changes.traspaso.currentValue) {
    }
  }
}
