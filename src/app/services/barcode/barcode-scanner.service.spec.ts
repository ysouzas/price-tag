import { TestBed } from '@angular/core/testing';

import { BarcodeScannerService } from './barcode-scanner.service';

describe('BarcodeScannerService', () => {
  let service: BarcodeScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarcodeScannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check camera availability', () => {
    const available = service.isCameraAvailable();
    expect(typeof available).toBe('boolean');
  });
});
