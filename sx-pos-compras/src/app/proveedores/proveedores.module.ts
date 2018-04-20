import { NgModule } from '@angular/core';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { SharedModule } from '../_shared/shared.module';

import { services } from './services';

@NgModule({
  imports: [SharedModule, ProveedoresRoutingModule],
  declarations: [],
  providers: [...services]
})
export class ProveedoresModule {}
