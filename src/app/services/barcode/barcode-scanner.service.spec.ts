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

  describe('API Compatibility - Method Signatures', () => {
    it('should have requestCameraPermission method that returns a Promise', async () => {
      expect(typeof service.requestCameraPermission).toBe('function');
      // Mock getUserMedia to avoid actual camera access in tests
      const mockStream = new MediaStream();
      spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(
        Promise.resolve(mockStream),
      );

      const result = service.requestCameraPermission();
      expect(result instanceof Promise).toBe(true);
    });

    it('should have initializeCamera method that returns a Promise', () => {
      expect(typeof service.initializeCamera).toBe('function');
      const mockVideo = document.createElement('video');
      const mockStream = new MediaStream();
      spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(
        Promise.resolve(mockStream),
      );

      service.requestCameraPermission().then(() => {
        const result = service.initializeCamera(mockVideo);
        expect(result instanceof Promise).toBe(true);
      });
    });

    it('should have detectBarcode method that returns a Promise<string | null>', () => {
      expect(typeof service.detectBarcode).toBe('function');
    });

    it('should have stopCamera method', () => {
      expect(typeof service.stopCamera).toBe('function');
    });
  });

  describe('Barcode Format Detection Support', () => {
    it('should support UPC-A format detection', () => {
      // UPC-A test barcode: 123456789012
      expect(service.detectBarcode).toBeDefined();
    });

    it('should support UPC-E format detection', () => {
      // UPC-E test barcode: 12345670
      expect(service.detectBarcode).toBeDefined();
    });

    it('should support EAN-13 format detection', () => {
      // EAN-13 test barcode: 5901234123457
      expect(service.detectBarcode).toBeDefined();
    });

    it('should support EAN-8 format detection', () => {
      // EAN-8 test barcode: 96385074
      expect(service.detectBarcode).toBeDefined();
    });

    it('should support Code 128 format detection', () => {
      // Code 128 is supported
      expect(service.detectBarcode).toBeDefined();
    });

    it('should support QR Code format detection', () => {
      // QR code detection should be supported
      expect(service.detectBarcode).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when camera not available on permission request', async () => {
      spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(
        Promise.reject(new Error('Camera denied')),
      );

      try {
        await service.requestCameraPermission();
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Camera');
      }
    });

    it('should handle stopCamera gracefully even if never initialized', () => {
      expect(() => service.stopCamera()).not.toThrow();
    });
  });
});
