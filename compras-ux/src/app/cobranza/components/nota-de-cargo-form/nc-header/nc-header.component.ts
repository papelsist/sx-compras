import { Component, OnInit, Input } from '@angular/core';
import { NotaDeCargo } from 'app/cobranza/models';

@Component({
  selector: 'sx-nc-header',
  template: `
  <div class="mat-title pad-top pad-left pad-right" layout>
    <span class="pad-right">Nota de cargo:</span>
    <span class="pad-left" class="tc-indigo-800">
      {{ nota.tipo }} - {{ nota.folio }}
    </span>
    <span class="pad-left">{{ nota.nombre }}</span>
    <span flex></span>
    <span>({{ nota.fecha | date: 'dd/MM/yyyy' }})</span>
  </div>
  `
})
export class NcHeaderComponent implements OnInit {
  @Input()
  nota: NotaDeCargo;

  constructor() {}

  ngOnInit() {}
}
