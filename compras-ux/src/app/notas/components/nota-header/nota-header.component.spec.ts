import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaHeaderComponent } from './nota-header.component';

describe('NotaHeaderComponent', () => {
  let component: NotaHeaderComponent;
  let fixture: ComponentFixture<NotaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
