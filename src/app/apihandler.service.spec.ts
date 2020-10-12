import { TestBed } from '@angular/core/testing';

import { ApihandlerService } from './apihandler.service';

describe('ApihandlerService', () => {
  let service: ApihandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApihandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
