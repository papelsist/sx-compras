import { NgModule } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';
import { OrdenesRoutingModule } from './ordenes-routing.module';

// Components
import { components, entryComponents } from './components';

// Containers
import { containers } from './containers';

// Services
import { services } from './services';
import { StoreModule } from '@ngrx/store';
import * as fromState from './store/reducers';

@NgModule({
  imports: [
    SharedModule,
    OrdenesRoutingModule,
    StoreModule.forFeature('state', fromState.reducers, {
      metaReducers: fromState.metaReducers
    })
  ],
  declarations: [...components, ...containers],
  entryComponents: [...entryComponents],
  providers: [...services]
})
export class OrdenesModule {}
