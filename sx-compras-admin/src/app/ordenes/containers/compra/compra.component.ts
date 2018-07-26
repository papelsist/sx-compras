import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Compra } from '../../models/compra';

@Component({
  selector: 'sx-compra',
  template: `
    <div>
      <sx-compra-form [compra]="compra$ | async"></sx-compra-form>
    </div>
  `
})
export class CompraComponent implements OnInit {
  compra$: Observable<Compra>;
  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {}

  onSave(event: Compra) {
    console.log('Salvando compra: ', event);
  }
}
