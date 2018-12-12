import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sx-estado-de-cuenta',
  template: `
  <td-layout-nav>
    <div td-toolbar-content layout="row" layout-align="start center" flex>
      <button mat-icon-button td-menu-button tdLayoutToggle>
        <mat-icon>menu</mat-icon>
      </button>
      <span class="cursor-pointer">Estado de cuenta </span> <span flex></span>
      <sx-estado-de-cuenta-btn></sx-estado-de-cuenta-btn>
    </div>

    <div layout-gt-sm="row" tdMediaToggle="gt-xs" [mediaClasses]="['push-sm']">
      <div flex-gt-sm="50">
        <sx-cuentas-card></sx-cuentas-card>
      </div>
    </div>
    <td-layout-footer>
      <sx-footer></sx-footer>
    </td-layout-footer>
  </td-layout-nav>

  `
})
export class EstadoDeCuentaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
