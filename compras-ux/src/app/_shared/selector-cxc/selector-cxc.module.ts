import { NgModule } from '@angular/core';

import { MaterialModule } from '../_material/material.module';

import { SelectorModalComponent } from './selector-modal/selector-modal.component';
import { SelectorCxcBtnComponent } from './selector-cxc-btn/selector-cxc-btn.component';

@NgModule({
  declarations: [SelectorModalComponent, SelectorCxcBtnComponent],
  entryComponents: [SelectorModalComponent],
  imports: [MaterialModule],
  exports: [SelectorCxcBtnComponent]
})
export class SelectorCxcModule {}
