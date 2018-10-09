import { Component, OnInit, Input } from '@angular/core';

import { AuthSession } from 'app/auth/models/authSession';

@Component({
  selector: 'sx-footer',
  template: `
    <div layout="row" layout-align="start center">
      <span class="md-caption">Copyright &copy; 2017 Luxsoft Mx. All rights reserved</span>
      <span flex></span>
      <ng-container *ngIf="session">
        <mat-icon color="accent">person</mat-icon>
        <span *ngIf="session.user; else username" class="pad-left">
          {{session.user.nombre}}
        </span>
        <ng-template #username>
          <span class="pad-left">{{session.username}}</span>
        </ng-template>
        <mat-icon class="pad-left" *ngIf="session.apiInfo" matTooltip="{{session.apiInfo | json}}">
          settings_remote
        </mat-icon>
      </ng-container>
    </div>
  `
})
export class FooterComponent implements OnInit {
  @Input()
  session: AuthSession;

  constructor() {}

  ngOnInit() {
    /*
    this.store
      .pipe(select(fromAuth.getSession))
      .subscribe(session => (this.session = session));
      */
  }
}
