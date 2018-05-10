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
  styles: [
    `.marcas-container {
      display: flex;
      flex-direction: column;
      min-width: 300px;
      overflow: auto;
      max-height: 500px;
    }
  `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarcasListComponent implements OnInit {
  @Input() marcas = [];

  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() info = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
