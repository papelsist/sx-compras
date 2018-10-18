import { Component, OnInit, Input } from '@angular/core';

import { User } from 'app/auth/models/user';

@Component({
  selector: 'sx-footer',
  template: `
    <div layout="row" layout-align="start center">
      <span class="md-caption">Copyright &copy; 2017 Luxsoft Mx. All rights reserved</span>
      <span flex></span>

      <ng-container *ngIf="user">
        <mat-icon color="accent">person</mat-icon>
        <span class="pad-left">
          {{user.nombre}}
        </span>
        <mat-icon class="pad-left" *ngIf="apiInfo" matTooltip="{{apiInfo | json}}">
          settings_remote
        </mat-icon>
      </ng-container>
    </div>
  `
})
export class FooterComponent implements OnInit {
  @Input()
  user: User;
  @Input()
  apiInfo: any;

  constructor() {}

  ngOnInit() {
    /*
    this.store
      .pipe(select(fromAuth.getSession))
      .subscribe(session => (this.session = session));
      */
  }
}
