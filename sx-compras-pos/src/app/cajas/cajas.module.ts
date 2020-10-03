import { NgModule } from '@angular/core';

 import { SharedModule } from '../_shared/shared.module';
 import { CajasRoutingModule } from './cajas-routing.module';


// import { StoreModule } from '@ngrx/store';
//     simport { EffectsModule } from '@ngrx/effects';
// import { reducers, effects } from './store';
// import { guards } from './guards';

// Components

 import { components } from './components';

// Containers
 import { containers } from './containers';

// Services
// import { services } from './services';
// import { AuthModule } from '../auth/auth.module';
// import { ReportesModule } from '../reportes/reportes.module';


@NgModule({
  imports: [
    SharedModule,
    CajasRoutingModule,
    // AuthModule,
    // ReportesModule,
    // OrdenesRoutingModule,
    // StoreModule.forFeature('ordenes', reducers),
    // EffectsModule.forFeature(effects)
  ],
  declarations: [
     ...containers,  ...components,
    ],
  entryComponents: [
    //  ...entryComponents
    ],
  providers: [
    //  ...services, ...guards
    ]

})
export class CajasModule {}
