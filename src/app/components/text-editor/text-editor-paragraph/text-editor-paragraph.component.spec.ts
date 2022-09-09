import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorParagraphComponent } from './text-editor-paragraph.component';

describe('TextEditorParagraphComponent', () => {
  let component: TextEditorParagraphComponent;
  let fixture: ComponentFixture<TextEditorParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextEditorParagraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextEditorParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
