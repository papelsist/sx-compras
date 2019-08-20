import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';
import { AuthModule } from '../auth/auth.module';

import { InventariosRoutingModule } from './inventarios-routing.module';
import { InventariosPageComponent } from './inventarios-page/inventarios-page.component';

@NgModule({
  declarations: [InventariosPageComponent],
  imports: [SharedModule, AuthModule, InventariosRoutingModule]
})
export class InventariosModule {}
