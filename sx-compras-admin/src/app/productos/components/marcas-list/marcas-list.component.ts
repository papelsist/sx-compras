import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'sx-marcas-list',
  templateUrl: './marcas-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarcasListComponent implements OnInit {
  @Input() marcas = [];

  @Output() select = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
