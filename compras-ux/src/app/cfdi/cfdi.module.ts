import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';
import { PrintCfdiComponent } from './components/print-cfdi/print-cfdi.component';
import { EmailCfdiComponent } from './components/email-cfdi/email-cfdi.component';
import { CfdiXmlComponent } from './components/cfdi-xml/cfdi-xml.component';

@NgModule({
  declarations: [PrintCfdiComponent, EmailCfdiComponent, CfdiXmlComponent],
  exports: [PrintCfdiComponent, EmailCfdiComponent, CfdiXmlComponent],
  imports: [SharedModule]
})
export class CfdiModule {}
