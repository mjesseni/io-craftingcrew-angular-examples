import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicklistAttributeComponent } from './picklist-attribute.component';

describe('PicklistAttributeComponent', () => {
  let component: PicklistAttributeComponent;
  let fixture: ComponentFixture<PicklistAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicklistAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicklistAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
