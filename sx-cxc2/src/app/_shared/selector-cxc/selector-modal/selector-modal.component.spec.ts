import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorModalComponent } from './selector-modal.component';

describe('SelectorModalComponent', () => {
  let component: SelectorModalComponent;
  let fixture: ComponentFixture<SelectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
