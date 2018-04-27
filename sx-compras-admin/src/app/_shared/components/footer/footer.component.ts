import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sx-footer',
  template: `
    <div layout="row" layout-align="start center">
      <span class="md-caption">Copyright &copy; 2017 Luxsoft Mx. All rights reserved</span>
    </div>
  `
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
