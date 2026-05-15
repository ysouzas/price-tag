
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScannerService } from '@services/barcode/barcode-scanner.service';

@Component({
    selector: 'app-barcode-scan-dialog',
    imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
],
    template: `
    <h2 mat-dialog-title>{{ 'SCANNER.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <div class="scanner-container">
        <video #videoElement autoplay playsinline muted></video>
        <canvas #canvasElement style="display: none;"></canvas>
        <div class="scanner-overlay">
          <div class="scanner-laser"></div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .scanner-container {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: 12px;
      background: #000;
    }
    video { width: 100%; height: 100%; object-fit: cover; }
    .scanner-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .scanner-laser {
      width: 80%;
      height: 2px;
      background: #f44336;
      box-shadow: 0 0 8px #f44336;
      animation: scan 2s infinite ease-in-out;
    }
    @keyframes scan {
      0%, 100% { transform: translateY(-100px); }
      50% { transform: translateY(100px); }
    }
  `]
})
export class BarcodeScanDialogComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  private isScanning = false;

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private dialogRef: MatDialogRef<BarcodeScanDialogComponent>
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.startScanning(), 500);
  }

  private async startScanning(): Promise<void> {
    try {
      await this.barcodeScannerService.requestCameraPermission();
      await this.barcodeScannerService.initializeCamera(this.videoElement.nativeElement);
      this.isScanning = true;
      this.scanLoop();
    } catch (err) {
      console.error(err);
      this.dialogRef.close();
    }
  }

  private scanLoop(): void {
    if (!this.isScanning) return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.barcodeScannerService.detectBarcode(canvas).then(barcode => {
        if (barcode) {
          this.playSuccessSound();
          this.dialogRef.close(barcode);
        } else {
          requestAnimationFrame(() => this.scanLoop());
        }
      });
    } else {
      requestAnimationFrame(() => this.scanLoop());
    }
  }

  private playSuccessSound(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {}
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.isScanning = false;
    this.barcodeScannerService.stopCamera();
  }
}
