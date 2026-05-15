import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScannerService } from '@services/barcode/barcode-scanner.service';

type ScannerState = 'idle' | 'scanning' | 'permission-denied' | 'no-camera';

@Component({
  selector: 'app-barcode-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
    RouterModule,
    MatRippleModule,
  ],
  templateUrl: './barcode-home.component.html',
  styleUrl: './barcode-home.component.scss',
})
export class BarcodeHomeComponent implements OnDestroy {
  @ViewChild('videoElement') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;

  barcodeControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d+$/),
  ]);

  scannerState: ScannerState = 'idle';
  private scanInterval: any;

  constructor(
    private router: Router,
    private scannerService: BarcodeScannerService,
  ) {}

  submitBarcode(): void {
    const value = this.barcodeControl.value;
    if (value) {
      this.router.navigate(['/product', value]);
    }
  }

  async toggleScanner(): Promise<void> {
    if (this.scannerState === 'scanning') {
      this.stopScanner();
      return;
    }

    if (!this.scannerService.isCameraAvailable()) {
      this.scannerState = 'no-camera';
      return;
    }

    try {
      this.scannerState = 'scanning';
      await this.scannerService.requestCameraPermission();
      // Wait one tick for *ngIf to render the video element
      setTimeout(async () => {
        await this.scannerService.initializeCamera(this.videoRef.nativeElement);
        this.startScanLoop();
      }, 100);
    } catch (err: any) {
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        this.scannerState = 'permission-denied';
      } else {
        this.scannerState = 'no-camera';
      }
    }
  }

  private startScanLoop(): void {
    const video = this.videoRef?.nativeElement;
    const canvas = this.canvasRef?.nativeElement;
    if (!video || !canvas) return;

    this.scanInterval = setInterval(async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')!.drawImage(video, 0, 0);
        const barcode = await this.scannerService.detectBarcode(canvas);
        if (barcode) {
          this.stopScanner();
          this.router.navigate(['/product', barcode]);
        }
      }
    }, 200);
  }

  private stopScanner(): void {
    clearInterval(this.scanInterval);
    this.scannerService.stopCamera();
    this.scannerState = 'idle';
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
