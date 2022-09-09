import { TestBed } from '@angular/core/testing';

import { HistoryTrackerService } from './history-tracker.service';

describe('HistoryTrackerService', () => {
  let service: HistoryTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
