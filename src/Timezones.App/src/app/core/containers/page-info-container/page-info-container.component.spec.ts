import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInfoContainerComponent } from './page-info-container.component';

describe('PageInfoContainerComponent', () => {
  let component: PageInfoContainerComponent;
  let fixture: ComponentFixture<PageInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageInfoContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
