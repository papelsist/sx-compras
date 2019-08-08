import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExistenciasRoutingModule } from './existencias-routing.module';
import { ExistenciasComponent } from './pages/existencias/existencias.component';
import { ExistenciasTableComponent } from './components/existencias-table/existencias-table.component';

@NgModule({
  declarations: [ExistenciasComponent, ExistenciasTableComponent],
  imports: [
    CommonModule,
    ExistenciasRoutingModule
  ]
})
export class ExistenciasModule { }
