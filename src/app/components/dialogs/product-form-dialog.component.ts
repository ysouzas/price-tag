import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BarcodeScanDialogComponent } from './barcode-scan-dialog.component';
import { ProductService, Product } from '../../services/product/product.service';

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'PRODUCT.CREATE_TITLE' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'PRODUCT.NAME' | translate }}</mat-label>
          <input matInput formControlName="name" placeholder="Product name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'PRODUCT.BARCODE' | translate }}</mat-label>
          <input matInput formControlName="barcode" placeholder="Barcode" />
          <button mat-icon-button matSuffix (click)="openScanner()" type="button">
            <mat-icon>qr_code_scanner</mat-icon>
          </button>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-flat-button color="primary" 
              [disabled]="productForm.invalid || isSaving" 
              (click)="onSave()">
        {{ 'COMMON.SAVE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 0.5rem;
      min-width: 300px;
    }
    mat-form-field { width: 100%; }
  `]
})
export class ProductFormDialogComponent {
  productForm: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barcode?: string }
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      barcode: [data?.barcode || '', Validators.required]
    });
  }

  openScanner(): void {
    const scanRef = this.dialog.open(BarcodeScanDialogComponent, {
      width: '400px',
      maxWidth: '90vw'
    });

    scanRef.afterClosed().subscribe(result => {
      if (result) {
        this.productForm.patchValue({ barcode: result });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.isSaving = true;
      this.productService.create(this.productForm.value).subscribe({
        next: (product: Product) => {
          this.dialogRef.close(product);
        },
        error: (err: any) => {
          console.error(err);
          this.isSaving = false;
          // Handle error (e.g. duplicate barcode)
        }
      });
    }
  }
}
