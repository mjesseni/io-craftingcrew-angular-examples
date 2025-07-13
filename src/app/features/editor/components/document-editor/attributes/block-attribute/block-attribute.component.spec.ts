import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockAttributeComponent } from './block-attribute.component';

describe('BlockAttributeComponent', () => {
  let component: BlockAttributeComponent;
  let fixture: ComponentFixture<BlockAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
