import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { CxpRoutingModule } from './cxp-routing.module';

import { containers } from './containers';

@NgModule({
  imports: [SharedModule, CxpRoutingModule],
  declarations: [...containers]
})
export class CxpModule {}
