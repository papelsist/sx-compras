import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/_shared/shared.module';

import { components, entryComponents } from './components';
import { pages } from './pages';

@NgModule({
  declarations: [...components, ...entryComponents, ...pages],
  imports: [RouterModule, SharedModule],
  exports: [...components, ...entryComponents]
})
export class NcreditoModule {}
