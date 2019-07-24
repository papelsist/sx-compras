import { NgModule } from '@angular/core';
import { SharedModule } from 'app/_shared/shared.module';

import { SelectorModalComponent } from './selector-modal/selector-modal.component';
import { SelectorTableComponent } from './selector-table/selector-table.component';

@NgModule({
  declarations: [SelectorModalComponent, SelectorTableComponent],
  entryComponents: [SelectorModalComponent],
  imports: [SharedModule]
})
export class ProductosSelectorModule {}
