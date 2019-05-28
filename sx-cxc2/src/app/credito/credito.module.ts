import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { CreditoRoutingModule } from './credito-routing.module';
import { CreditoPageComponent } from './credito-page/credito-page.component';

import { NcreditoModule } from 'app/cobranza/ncredito/ncredito.module';

@NgModule({
  declarations: [CreditoPageComponent],
  imports: [SharedModule, CreditoRoutingModule, NcreditoModule]
})
export class CreditoModule {}
