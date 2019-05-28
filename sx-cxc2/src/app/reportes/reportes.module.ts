import { NgModule } from '@angular/core';

import { components, entryComponents } from './components';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [...components],
  entryComponents: [...entryComponents],
  exports: [...components]
})
export class ReportesModule {
  /*
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ReportesModule,
      providers: [ReportService]
    };
  }
  */
}
