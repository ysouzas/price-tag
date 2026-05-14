import { Injectable } from '@angular/core';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private codeReader: BrowserMultiFormatReader | null = null;

  isCameraAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async requestCameraPermission(): Promise<void> {
    if (!this.isCameraAvailable()) {
      throw new Error('Camera not available');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
    } catch (error) {
      console.error('Camera permission error:', error);
      throw error;
    }
  }

  async initializeCamera(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.stream) {
      throw new Error('No camera stream available');
    }

    this.video = videoElement;
    this.video.srcObject = this.stream;

    return new Promise((resolve) => {
      this.video!.onloadedmetadata = () => {
        this.video!.play();
        resolve();
      };
    });
  }

  async detectBarcode(canvas: HTMLCanvasElement): Promise<string | null> {
    if (!this.codeReader) {
      this.codeReader = new BrowserMultiFormatReader();
    }

    try {
      // First try native Barcode Detection API if available
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: [
              'ean_13',
              'ean_8',
              'code_128',
              'upc_a',
              'upc_e',
              'qr_code',
            ],
          });

          const barcodes = await barcodeDetector.detect(canvas);
          if (barcodes.length > 0) {
            return barcodes[0].rawValue;
          }
        } catch (error) {
          console.debug(
            'Native detector failed, falling back to ZXing:',
            error,
          );
        }
      }

      // Fall back to ZXing.js
      try {
        const result = (this.codeReader as any).decodeFromCanvas(canvas);
        if (result) {
          return result.getText();
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          // No barcode detected in current frame
        } else {
          console.debug('ZXing detection error:', error);
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        // No barcode detected in current frame
      } else {
        console.debug('Barcode detection error:', error);
      }
    }

    return null;
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
  }
}
