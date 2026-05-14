import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeHomeComponent } from './barcode-home.component';

describe('BarcodeHomeComponent', () => {
  let component: BarcodeHomeComponent;
  let fixture: ComponentFixture<BarcodeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarcodeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
