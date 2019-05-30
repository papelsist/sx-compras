import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { CreditoRoutingModule } from './credito-routing.module';
import { CreditoPageComponent } from './credito-page/credito-page.component';

import { CobranzaModule } from 'app/cobranza/cobranza.module';

@NgModule({
  declarations: [CreditoPageComponent],
  imports: [SharedModule, CreditoRoutingModule, CobranzaModule]
})
export class CreditoModule {}
