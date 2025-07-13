import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooleanAttributeComponent } from './boolean-attribute.component';

describe('BooleanAttributeComponent', () => {
  let component: BooleanAttributeComponent;
  let fixture: ComponentFixture<BooleanAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooleanAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooleanAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
