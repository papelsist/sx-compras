import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaCreateModalComponent } from './nota-create-modal.component';

describe('NotaCreateModalComponent', () => {
  let component: NotaCreateModalComponent;
  let fixture: ComponentFixture<NotaCreateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaCreateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
