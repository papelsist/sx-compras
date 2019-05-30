import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Bonificacion } from 'app/cobranza/models';

@Component({
  selector: 'sx-bonificacion-edit-page',
  templateUrl: './bonificacion-edit-page.component.html',
  styleUrls: ['./bonificacion-edit-page.component.scss']
})
export class BonificacionEditPageComponent implements OnInit {
  bonificacion$: Observable<Bonificacion>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.bonificacion$ = this.store.pipe(
      select(fromStore.getSelectedBonificacion)
    );
  }
}
