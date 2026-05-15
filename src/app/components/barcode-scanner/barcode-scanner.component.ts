import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { NgxScannerQrcodeModule } from '@zxing/ngx-scanner';
import { BarcodeScannerService } from '@services/barcode/barcode-scanner.service';

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
    NgxScannerQrcodeModule,
  ],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class BarcodeScannerComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isScanning = false;
  isCameraAvailable = false;
  cameraPermissionDenied = false;
  scanningActive = false;
  detectedBarcode: string | null = null;
  lastScannedBarcode: string | null = null;
  cameraError: string | null = null;

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
      this.startScanning();
    }
  }

  startScanning(): void {
    if (this.isCameraAvailable && !this.isScanning) {
      this.isScanning = true;
      this.scanningActive = true;
      this.cameraError = null;
    }
  }

  stopScanning(): void {
    this.isScanning = false;
    this.scanningActive = false;
  }

  /**
   * Handle barcode detection result from zxing-scanner component
   */
  onCodeResult(result: string): void {
    if (result && result !== this.lastScannedBarcode) {
      this.detectedBarcode = result;
      this.lastScannedBarcode = result;
      this.playSuccessSound();
      this.form.patchValue({ manualBarcode: result });
    }
  }

  /**
   * Handle camera permission errors
   */
  onCameraPermissionError(error: any): void {
    console.error('Camera permission error:', error);
    this.cameraPermissionDenied = true;
    this.isScanning = false;
    this.scanningActive = false;
    this.cameraError = error?.message || 'Camera permission denied';
  }

  /**
   * Handle general scanner errors
   */
  onScannerError(error: any): void {
    console.error('Scanner error:', error);
    this.cameraError = error?.message || 'Camera unavailable';
    this.isScanning = false;
    this.scanningActive = false;
  }

  onSubmitBarcode(): void {
    if (this.form.invalid) {
      return;
    }

    const barcode = this.form.get('manualBarcode')?.value;
    if (barcode) {
      this.detectedBarcode = barcode;
      this.playSuccessSound();
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
  }
}
