import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'sx-clases-list',
  templateUrl: './clases-list.components.html',
  styles: [
    `.mat-nav-list {
      overflow: auto;
      max-height: 410px;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClasesListComponent implements OnInit {
  @Input() clases = [];

  @Output() select = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
