import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeContainerComponent } from './attribute-container.component';

describe('AttributeContainerComponent', () => {
  let component: AttributeContainerComponent;
  let fixture: ComponentFixture<AttributeContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
