import { TestBed } from '@angular/core/testing';

import { DataviewService } from './dataview.service';

describe('DataviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataviewService = TestBed.get(DataviewService);
    expect(service).toBeTruthy();
  });
});
