import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasTableComponent } from './notas-table.component';

describe('NotasTableComponent', () => {
  let component: NotasTableComponent;
  let fixture: ComponentFixture<NotasTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotasTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
