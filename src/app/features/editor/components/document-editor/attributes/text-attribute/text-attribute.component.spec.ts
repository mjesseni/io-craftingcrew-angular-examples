import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAttributeComponent } from './text-attribute.component';

describe('TextAttributeComponent', () => {
  let component: TextAttributeComponent;
  let fixture: ComponentFixture<TextAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
