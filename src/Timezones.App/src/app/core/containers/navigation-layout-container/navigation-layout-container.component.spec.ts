import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationLayoutContainerComponent } from './navigation-layout-container.component';

describe('NavigationLayoutContainerComponent', () => {
  let component: NavigationLayoutContainerComponent;
  let fixture: ComponentFixture<NavigationLayoutContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationLayoutContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationLayoutContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
