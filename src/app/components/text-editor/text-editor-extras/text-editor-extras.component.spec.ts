import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorExtrasComponent } from './text-editor-extras.component';

describe('TextEditorExtrasComponent', () => {
  let component: TextEditorExtrasComponent;
  let fixture: ComponentFixture<TextEditorExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextEditorExtrasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextEditorExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
