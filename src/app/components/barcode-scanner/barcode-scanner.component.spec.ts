import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScannerComponent } from './barcode-scanner.component';

describe('BarcodeScannerComponent', () => {
  let component: BarcodeScannerComponent;
  let fixture: ComponentFixture<BarcodeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeScannerComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BarcodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check camera availability on init', () => {
    expect(
      component.isCameraAvailable || component.cameraPermissionDenied,
    ).toBeDefined();
  });

  it('should validate barcode format', () => {
    const barcodeControl = component.form.get('manualBarcode');

    // Should fail for too short
    barcodeControl?.setValue('12');
    expect(barcodeControl?.hasError('minlength')).toBeTruthy();

    // Should fail for special characters
    barcodeControl?.setValue('123!');
    expect(barcodeControl?.hasError('pattern')).toBeTruthy();

    // Should pass for numeric
    barcodeControl?.setValue('0123456789');
    expect(barcodeControl?.invalid).toBeFalsy();

    // Should pass for alphanumeric
    barcodeControl?.setValue('ABC123XYZ');
    expect(barcodeControl?.invalid).toBeFalsy();
  });
});
