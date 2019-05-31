import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

import { SharedModule } from 'app/_shared/shared.module';

import { components, entryComponents } from './components';
import { pages } from './pages';
import { NotasRoutingModule } from './notas.routing.module';

@NgModule({
  declarations: [...components, ...entryComponents, ...pages],
  imports: [
    RouterModule,
    SharedModule,
    NotasRoutingModule,
    StoreModule.forFeature('notas', reducers),
    EffectsModule.forFeature(effects)
  ],
  exports: [...components, ...entryComponents]
})
export class NotasModule {}