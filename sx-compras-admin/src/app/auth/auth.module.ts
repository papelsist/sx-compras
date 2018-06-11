import { NgModule, ModuleWithProviders } from '@angular/core';

import { SharedModule } from '../_shared/shared.module';

import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducers';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [SharedModule],
  declarations: []
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: []
    };
  }
}

@NgModule({
  imports: [AuthRoutingModule, StoreModule.forFeature('auth', reducer)]
})
export class RootAuthModule {}
