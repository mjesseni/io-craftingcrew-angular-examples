import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAttributeComponent } from './table-attribute.component';

describe('TableAttributeComponent', () => {
  let component: TableAttributeComponent;
  let fixture: ComponentFixture<TableAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
