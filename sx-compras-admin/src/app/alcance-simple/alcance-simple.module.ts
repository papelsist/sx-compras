import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from 'app/_shared/shared.module';
import { AlcPageComponent } from './alc-page/alc-page.component';
import { AlcTableComponent } from './alc-table/alc-table.component';

const routes: Routes = [{ path: '', component: AlcPageComponent }];

@NgModule({
  declarations: [AlcPageComponent, AlcTableComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AlcanceSimpleModule {}
