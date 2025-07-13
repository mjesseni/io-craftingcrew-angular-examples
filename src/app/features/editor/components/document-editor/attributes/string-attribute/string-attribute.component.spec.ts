import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringAttributeComponent } from './string-attribute.component';

describe('StringAttributeComponent', () => {
  let component: StringAttributeComponent;
  let fixture: ComponentFixture<StringAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StringAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
