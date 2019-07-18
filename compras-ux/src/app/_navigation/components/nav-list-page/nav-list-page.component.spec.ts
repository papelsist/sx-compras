import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavListPageComponent } from './nav-list-page.component';

describe('NavListPageComponent', () => {
  let component: NavListPageComponent;
  let fixture: ComponentFixture<NavListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
