import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScannerService } from '../../services/barcode/barcode-scanner.service';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class BarcodeScannerComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  form!: FormGroup;
  isScanning = false;
  isCameraAvailable = false;
  cameraPermissionDenied = false;
  scanningActive = false;
  detectedBarcode: string | null = null;
  lastScannedBarcode: string | null = null;

  constructor(
    private fb: FormBuilder,
    private barcodeScannerService: BarcodeScannerService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkCameraAvailability();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      manualBarcode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    });
  }

  private checkCameraAvailability(): void {
    this.isCameraAvailable = this.barcodeScannerService.isCameraAvailable();
    if (this.isCameraAvailable) {
      this.requestCameraPermission();
    }
  }

  private requestCameraPermission(): void {
    this.barcodeScannerService
      .requestCameraPermission()
      .then(() => {
        this.initializeCamera();
      })
      .catch((error) => {
        console.error('Camera permission denied:', error);
        this.cameraPermissionDenied = true;
      });
  }

  private initializeCamera(): void {
    if (this.videoElement && this.isCameraAvailable) {
      this.barcodeScannerService
        .initializeCamera(this.videoElement.nativeElement)
        .then(() => {
          this.scanningActive = true;
          this.startScanning();
        })
        .catch((error) => {
          console.error('Failed to initialize camera:', error);
          this.isCameraAvailable = false;
        });
    }
  }

  startScanning(): void {
    if (!this.videoElement || !this.canvasElement) {
      return;
    }

    this.isScanning = true;
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        this.barcodeScannerService
          .detectBarcode(canvas)
          .then((barcode) => {
            if (barcode && barcode !== this.lastScannedBarcode) {
              this.detectedBarcode = barcode;
              this.lastScannedBarcode = barcode;
              this.playSuccessSound();
              // Update form with detected barcode
              this.form.patchValue({ manualBarcode: barcode });
            }
          })
          .catch((error) => {
            console.debug('Barcode detection attempt:', error);
          });
      }

      if (this.isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  }

  stopScanning(): void {
    this.isScanning = false;
    this.barcodeScannerService.stopCamera();
  }

  onSubmitBarcode(): void {
    if (this.form.invalid) {
      return;
    }

    const barcode = this.form.get('manualBarcode')?.value;
    if (barcode) {
      this.detectedBarcode = barcode;
      this.playSuccessSound();
      // Trigger product lookup
      console.log('Looking up product for barcode:', barcode);
    }
  }

  clearDetectedBarcode(): void {
    this.detectedBarcode = null;
    this.form.patchValue({ manualBarcode: '' });
  }

  private playSuccessSound(): void {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  ngOnDestroy(): void {
    if (this.isScanning) {
      this.stopScanning();
    }
  }
}
