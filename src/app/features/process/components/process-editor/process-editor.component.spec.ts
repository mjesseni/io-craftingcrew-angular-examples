import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessEditorComponent } from './process-editor.component';

describe('ProcessEditorComponent', () => {
  let component: ProcessEditorComponent;
  let fixture: ComponentFixture<ProcessEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
