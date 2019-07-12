import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../_shared/shared.module';

import { AuthModule } from '../auth/auth.module';

import { NavListPageComponent } from './components/nav-list-page/nav-list-page.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([]), AuthModule],
  declarations: [NavListPageComponent],
  exports: [],
  providers: []
})
export class NavigationModule {}
