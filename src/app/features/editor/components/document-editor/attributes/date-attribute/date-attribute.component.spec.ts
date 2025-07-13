import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAttributeComponent } from './date-attribute.component';

describe('DateAttributeComponent', () => {
  let component: DateAttributeComponent;
  let fixture: ComponentFixture<DateAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
