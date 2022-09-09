import { TestBed } from '@angular/core/testing';

import { WindowedEditorService } from './windowed-editor.service';

describe('WindowedEditorService', () => {
  let service: WindowedEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowedEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
