import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericAttributeComponent } from './numeric-attribute.component';

describe('NumericAttributeComponent', () => {
  let component: NumericAttributeComponent;
  let fixture: ComponentFixture<NumericAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
