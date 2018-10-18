import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';

import { Observable } from 'rxjs';
import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-analisis-de-venta-page',
  templateUrl: './analisis-de-venta-page.component.html',
  styleUrls: ['./analisis-de-venta-page.component.scss']
})
export class AnalisisDeVentaPageComponent implements OnInit {
  loading$: Observable<boolean>;
  user$: Observable<User>;
  api$: Observable<any>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {
    this.loading$ = this.store.pipe(select(fromStore.getNotasLoading));
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
  }
}
