import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sx-existencias',
  templateUrl: './existencias.component.html',
  styleUrls: ['./existencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExistenciasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
