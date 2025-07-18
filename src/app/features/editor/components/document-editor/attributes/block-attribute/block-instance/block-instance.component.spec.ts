import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockInstanceComponent } from './block-instance.component';

describe('BlockInstanceComponent', () => {
  let component: BlockInstanceComponent;
  let fixture: ComponentFixture<BlockInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockInstanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
