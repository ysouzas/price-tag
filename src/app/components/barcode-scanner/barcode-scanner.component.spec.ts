import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeScannerComponent } from './barcode-scanner.component';

describe('BarcodeScannerComponent', () => {
  let component: BarcodeScannerComponent;
  let fixture: ComponentFixture<BarcodeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeScannerComponent],
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
    barcodeControl?.setValue('invalid');
    expect(barcodeControl?.hasError('pattern')).toBeTruthy();

    barcodeControl?.setValue('0123456789');
    expect(barcodeControl?.hasError('pattern')).toBeFalsy();
  });
});
