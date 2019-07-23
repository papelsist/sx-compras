import { Component } from '@angular/core';
import {
  DateAdapter,
  MatIconRegistry,
  NativeDateAdapter
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel
} from '@angular/router';

@Component({
  selector: 'sx-root',
  templateUrl: './app.component.html',
  styles: [
    `
      :host {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        width: 100%;
        height: 100%;
        min-width: 0;
      }
    `
  ]
})
export class AppComponent {
  loading = false;

  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dateAdapter: DateAdapter<NativeDateAdapter>,
    private router: Router
  ) {
    this.iconRegistry.addSvgIconInNamespace(
      'assets',
      'siipapx',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/siipapx.svg'
      )
    );
    this.iconRegistry.addSvgIconInNamespace(
      'assets',
      'paper',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/paper.svg')
    );

    // moment.locale('es');
    dateAdapter.setLocale('es_MX');
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
        case event instanceof NavigationCancel: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
