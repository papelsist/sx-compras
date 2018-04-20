import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../_shared/shared.module';
import { MainPageComponent } from './containers/main-page/main-page.component';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { PagosUtils } from './services/pagos-utils.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([])],
  declarations: [MainPageComponent, HomePageComponent],
  providers: [PagosUtils]
})
export class CoreModule {}
