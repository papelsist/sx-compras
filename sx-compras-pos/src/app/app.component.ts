import { Component } from '@angular/core';
import { DateAdapter, MatIconRegistry, NativeDateAdapter } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'sx-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dateAdapter: DateAdapter<NativeDateAdapter>,
  ) {
    this.iconRegistry.addSvgIconInNamespace('assets', 'siipapx',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/siipapx.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'paper',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/paper.svg'));

    // moment.locale('es');
    dateAdapter.setLocale('es_MX');
  }
}
