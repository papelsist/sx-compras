import { Component, OnInit, Input } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../store';

import { Observable } from 'rxjs';

// import { AppConfig, NavigationRoute } from '@app/core/models';

export interface NavigationRoute {
  icon?: string;
  route?: string;
  title?: string;
}

@Component({
  selector: 'sx-nav-list-page',
  templateUrl: './nav-list-page.component.html',
  styleUrls: ['./nav-list-page.component.scss']
})
export class NavListPageComponent implements OnInit {
  @Input() title = 'PAGE TITLE';

  @Input() sidenavWidth = '270px';

  @Input() navigation: NavigationRoute[] = [];

  constructor(
    public media: TdMediaService,
    private store: Store<fromStore.State>
  ) {}

  ngOnInit() {}
}
