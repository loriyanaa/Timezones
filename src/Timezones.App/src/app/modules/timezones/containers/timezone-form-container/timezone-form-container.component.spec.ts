import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneFormContainerComponent } from './timezone-form-container.component';

describe('TimezoneFormContainerComponent', () => {
  let component: TimezoneFormContainerComponent;
  let fixture: ComponentFixture<TimezoneFormContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimezoneFormContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
