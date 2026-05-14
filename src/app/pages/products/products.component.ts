import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductFormDialogComponent } from '../../components/dialogs/product-form-dialog.component';
import { Product, ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule,
    RouterModule
  ],
  template: `
    <div class="page-container animate-fade-in">
      <header class="page-header">
        <h1 class="page-title">{{ 'PRODUCTS.TITLE' | translate }}</h1>
        <button mat-flat-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          {{ 'PRODUCTS.ADD_BUTTON' | translate }}
        </button>
      </header>

      @if (isLoading) {
        <div class="skeleton-list">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton card-skeleton"></div>
          }
        </div>
      } @else {
        <div class="product-grid">
          @for (product of products; track product.id) {
            <mat-card class="premium-card product-card" [routerLink]="['/product', product.barcode]">
              <mat-card-content>
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <div class="product-meta">
                    <span class="barcode-badge">
                      <mat-icon>qr_code</mat-icon>
                      {{ product.barcode }}
                    </span>
                  </div>
                </div>
                <mat-icon class="chevron">chevron_right</mat-icon>
              </mat-card-content>
            </mat-card>
          } @empty {
            <div class="empty-state">
              <mat-icon>inventory_2</mat-icon>
              <p>{{ 'PRODUCTS.EMPTY' | translate }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      .page-title { margin: 0; font-weight: 800; font-size: 2rem; }
    }
    .product-grid { display: flex; flex-direction: column; gap: 1rem; }
    .product-card {
      cursor: pointer;
      transition: transform 0.2s ease;
      &:hover { transform: translateY(-2px); }
      mat-card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem !important;
      }
    }
    .product-info {
      .product-name { margin: 0 0 0.5rem; font-weight: 700; }
      .product-meta {
        display: flex;
        gap: 0.75rem;
        font-size: 0.85rem;
        .barcode-badge, .category-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-muted);
          mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
        }
      }
    }
    .chevron { color: var(--border-color); }
    .skeleton-list { display: flex; flex-direction: column; gap: 1rem; }
    .card-skeleton { height: 80px; border-radius: 16px; }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
      mat-icon { font-size: 4rem; width: 4rem; height: 4rem; opacity: 0.2; margin-bottom: 1rem; }
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Product created!', 'OK', { duration: 3000 });
        this.loadProducts();
      }
    });
  }
}
