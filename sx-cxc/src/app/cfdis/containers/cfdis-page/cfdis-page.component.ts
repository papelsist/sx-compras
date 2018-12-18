import { Component, OnInit } from '@angular/core';

import { TdMediaService } from '@covalent/core';

import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromAuth from 'app/auth/store';

import { Observable } from 'rxjs';
import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-cfdis-page',
  template: `
    <td-layout-nav-list
      #navList
      [opened]="media.registerQuery('gt-sm') | async"
      [mode]="(media.registerQuery('gt-sm') | async) ? 'side' : 'over'"
      [sidenavWidth]="(media.registerQuery('gt-xs') | async) ? '275px' : '100%'"
    >
      <div td-sidenav-toolbar-content layout="row" layout-align="start center">
        <button mat-icon-button tdLayoutToggle>
          <mat-icon>menu</mat-icon>
        </button>
        <span [routerLink]="['/']" class="cursor-pointer">SX CXC</span>
      </div>

      <div td-toolbar-content layout="row" layout-align="start center" flex>
        <button mat-icon-button tdLayoutNavListOpen [hideWhenOpened]="true">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span tdLayoutNavListToggle class="cursor-pointer"
          >Comprobantes fiscales digitales</span
        >
        <span flex></span>
      </div>

      <mat-nav-list
        dense
        td-sidenav-content
        [tdLayoutNavListClose]="!media.query('gt-sm')"
      >
        <ng-template let-item let-last="last" ngFor [ngForOf]="navmenu">
          <a
            mat-list-item
            [routerLink]="[item.route]"
            routerLinkActive="active"
          >
            <mat-icon matListAvatar>{{ item.icon }}</mat-icon>
            <h3 matLine>{{ item.title }}</h3>
            <p matLine>{{ item.description }}</p>
          </a>
          <mat-divider [inset]="true" *ngIf="!last"></mat-divider>
        </ng-template>
        <mat-divider></mat-divider>

        <h3 matSubheader>Reportes</h3>

        <a mat-list-item>
          <mat-icon matListAvatar>picture_as_pdf</mat-icon>
          <h3 matLine>Por Cancelar</h3>
          <p matLine>CFDI's pendientes de cancelación</p>
        </a>
        <mat-divider></mat-divider>
      </mat-nav-list>

      <router-outlet></router-outlet>

      <td-layout-footer>
        <sx-footer [user]="user$ | async" [apiInfo]="api$ | async"></sx-footer>
      </td-layout-footer>
    </td-layout-nav-list>
  `,
  styles: [``]
})
export class CfdisPageComponent implements OnInit {
  navmenu: Object[] = [
    {
      route: 'generados',
      title: 'CFDIs',
      description: 'Comprobantes fiscales',
      icon: 'account_balance_wallet'
    },
    {
      route: 'porCancelar',
      title: 'Por CANCELAR',
      description: 'CFDIs pendientes de cancelar'
    },
    {
      route: 'cancelaciones',
      title: 'Cancelaciones ',
      description: 'Cancelación de CFDIs',
      icon: 'description'
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
