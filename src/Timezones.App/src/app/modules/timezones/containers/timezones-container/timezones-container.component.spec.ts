import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezonesContainerComponent } from './timezones-container.component';

describe('TimezonesContainerComponent', () => {
  let component: TimezonesContainerComponent;
  let fixture: ComponentFixture<TimezonesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimezonesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezonesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
