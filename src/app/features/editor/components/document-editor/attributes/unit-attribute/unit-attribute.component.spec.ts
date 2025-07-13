import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitAttributeComponent } from './unit-attribute.component';

describe('UnitAttributeComponent', () => {
  let component: UnitAttributeComponent;
  let fixture: ComponentFixture<UnitAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
