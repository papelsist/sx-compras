import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { CxpRoutingModule } from './cxp-routing.module';

import { components } from './components';
import { containers } from './containers';
import { services } from './services';

@NgModule({
  imports: [SharedModule, CxpRoutingModule],
  declarations: [...components, ...containers],
  providers: [...services]
})
export class CxpModule {}
