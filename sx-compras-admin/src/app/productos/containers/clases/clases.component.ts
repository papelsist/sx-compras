import { Component, OnInit } from '@angular/core';

import { ClasesService } from '../../services';

@Component({
  selector: 'sx-clases',
  templateUrl: './clases.component.html',
  styles: [``]
})
export class ClasesComponent implements OnInit {
  clases: any[];

  constructor(private service: ClasesService) {}

  ngOnInit() {
    this.service.list().subscribe(data => (this.clases = data));
  }
  onSelect(clase) {
    console.log('Select: ', clase);
  }
}
