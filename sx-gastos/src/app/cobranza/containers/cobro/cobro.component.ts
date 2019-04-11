import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';

import { Observable } from 'rxjs';

import { Cobro } from '../../models/cobro';

@Component({
  selector: 'sx-cobro',
  templateUrl: './cobro.component.html',
  styleUrls: ['./cobro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CobroComponent implements OnInit {
  cobro$: Observable<Cobro>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromStore.State>) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getCobrosLoading));
    this.cobro$ = this.store.pipe(select(fromStore.getSelectedCobro));
  }
}
