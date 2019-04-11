import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';

import { Observable } from 'rxjs';
import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-cobranza-page',
  templateUrl: './cobranza-page.component.html',
  styleUrls: ['./cobranza-page.component.scss']
})
export class CobranzaPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'cobros',
      title: 'Cobros',
      description: 'Cobros y aplicaciones'
    },
    {
      route: 'solicitudes',
      title: 'Depositos',
      description: 'Solicitudes de deposito'
    }
  ];

  user$: Observable<User>;
  api$: Observable<any>;

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {
    this.user$ = this.store.pipe(select(fromAuth.getUser));
    this.api$ = this.store.pipe(select(fromAuth.getApiInfo));
  }
}
