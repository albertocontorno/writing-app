import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorHeadingComponent } from './text-editor-heading.component';

describe('TextEditorHeadingComponent', () => {
  let component: TextEditorHeadingComponent;
  let fixture: ComponentFixture<TextEditorHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextEditorHeadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextEditorHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
