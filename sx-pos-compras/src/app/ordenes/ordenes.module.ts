import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { OrdenesRoutingModule } from './ordenes-routing.module';

// Components
import { components, entryComponents } from './components';

// Containers
import { containers } from './containers';

// Services
import { services } from './services';

@NgModule({
  imports: [SharedModule, OrdenesRoutingModule],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services]
})
export class OrdenesModule {}
