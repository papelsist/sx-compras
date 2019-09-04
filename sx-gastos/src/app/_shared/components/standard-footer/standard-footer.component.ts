import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sx-standard-footer',
  template: `
    <div class="footer" layout layout-align="center center">
      <span flex></span>
      <span>Registros: {{ totales.rows }}</span>
      <ng-content> </ng-content>
      <span flex></span>
    </div>
  `,
  styles: [
    `
      .footer {
        height: 50px;
      }
    `
  ]
})
export class StandardFooterComponent implements OnInit {
  @Input() totales = { rows: 0 };

  constructor() {}

  ngOnInit() {}
}
