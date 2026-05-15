import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BarcodeScannerService {
  /**
   * Check if the device has camera support
   * @returns true if camera is available
   */
  isCameraAvailable(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * @deprecated Camera permission handling is now managed by @zxing/ngx-scanner component.
   * This method is kept for backward compatibility but is no longer needed.
   */
  async requestCameraPermission(): Promise<void> {
    if (!this.isCameraAvailable()) {
      throw new Error('Camera not available');
    }
    // Permission request is now handled by zxing-scanner component
  }

  /**
   * @deprecated Camera initialization is now managed by @zxing/ngx-scanner component.
   * This method is kept for backward compatibility but is no longer needed.
   */
  async initializeCamera(videoElement: HTMLVideoElement): Promise<void> {
    // Camera initialization is now handled by zxing-scanner component
    console.warn(
      'initializeCamera is deprecated. Use @zxing/ngx-scanner component instead.',
    );
  }

  /**
   * @deprecated Barcode detection is now managed by @zxing/ngx-scanner component.
   * This method is kept for backward compatibility but is no longer needed.
   */
  async detectBarcode(canvas: HTMLCanvasElement): Promise<string | null> {
    console.warn(
      'detectBarcode is deprecated. Use @zxing/ngx-scanner component instead.',
    );
    return null;
  }

  /**
   * @deprecated Camera cleanup is now managed by @zxing/ngx-scanner component.
   * This method is kept for backward compatibility but is no longer needed.
   */
  stopCamera(): void {
    // Camera cleanup is now handled by zxing-scanner component
    console.warn(
      'stopCamera is deprecated. Use @zxing/ngx-scanner component instead.',
    );
  }
}
