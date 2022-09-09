import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WritingDesktopComponent } from './writing-desktop.component';

describe('WritingDesktopComponent', () => {
  let component: WritingDesktopComponent;
  let fixture: ComponentFixture<WritingDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WritingDesktopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WritingDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
