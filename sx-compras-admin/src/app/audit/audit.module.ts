import { NgModule } from '@angular/core';

import { SharedModule } from 'app/_shared/shared.module';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditPageComponent } from './audit-page/audit-page.component';
import { AuditTableComponent } from './audit-table/audit-table.component';

@NgModule({
  declarations: [AuditPageComponent, AuditTableComponent],
  imports: [SharedModule, AuditRoutingModule]
})
export class AuditModule {}
