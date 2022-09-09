import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorListComponent } from './text-editor-list.component';

describe('TextEditorListComponent', () => {
  let component: TextEditorListComponent;
  let fixture: ComponentFixture<TextEditorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextEditorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextEditorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
