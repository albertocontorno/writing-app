import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowedEditorComponent } from './windowed-editor.component';

describe('WindowedEditorComponent', () => {
  let component: WindowedEditorComponent;
  let fixture: ComponentFixture<WindowedEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WindowedEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WindowedEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
