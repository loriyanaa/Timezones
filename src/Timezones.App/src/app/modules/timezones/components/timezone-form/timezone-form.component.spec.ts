import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneFormComponent } from './timezone-form.component';

describe('TimezoneFormComponent', () => {
  let component: TimezoneFormComponent;
  let fixture: ComponentFixture<TimezoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimezoneFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
