import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { CarteraRoutingModule } from './cartera-routing.module';
import { CarteraTableComponent } from './cartera-table/cartera-table.component';
import { CarteraPageComponent } from './cartera-page/cartera-page.component';

@NgModule({
  declarations: [CarteraTableComponent, CarteraPageComponent],
  imports: [SharedModule, CarteraRoutingModule]
})
export class CarteraModule {
  constructor() {
    console.log('Cartera module up.....');
  }
}
