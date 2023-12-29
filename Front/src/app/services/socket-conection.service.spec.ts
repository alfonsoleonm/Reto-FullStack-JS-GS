import { TestBed } from '@angular/core/testing';

import { SocketConectionService } from './socket-conection.service';

describe('SocketConectionService', () => {
  let service: SocketConectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketConectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
