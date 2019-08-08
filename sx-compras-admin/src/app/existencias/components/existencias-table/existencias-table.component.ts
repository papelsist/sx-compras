import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sx-existencias-table',
  templateUrl: './existencias-table.component.html',
  styleUrls: ['./existencias-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExistenciasTableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
