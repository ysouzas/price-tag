import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
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
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'PRODUCT.CATEGORY' | translate }}</mat-label>
            <input matInput formControlName="category" placeholder="Category" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'PRODUCT.UNIT_TYPE' | translate }}</mat-label>
            <input matInput formControlName="unit_type" placeholder="Unit (e.g. kg, L, pack)" />
          </mat-form-field>
        </div>
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
    .row {
      display: flex;
      gap: 1rem;
      @media (max-width: 480px) {
        flex-direction: column;
        gap: 0;
      }
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
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { barcode?: string }
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      barcode: [data?.barcode || '', Validators.required],
      category: [''],
      unit_type: ['']
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
