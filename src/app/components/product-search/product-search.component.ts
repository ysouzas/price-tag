import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product, ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product-search',
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
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchResults: Product[] = [];
  isSearching = false;
  noResultsFound = false;
  selectedProduct: Product | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query && query.trim().length > 0) {
          this.performSearch(query);
        } else {
          this.resetSearch();
        }
      });
  }

  private performSearch(query: string): void {
    this.isSearching = true;
    this.noResultsFound = false;

    // Check if query is numeric (likely a barcode)
    const isBarcode = /^\d+$/.test(query);

    if (isBarcode) {
      this.productService.searchByBarcode(query)
        .pipe(takeUntil(this.destroy$))
        .subscribe((product) => {
          this.isSearching = false;
          if (product) {
            this.searchResults = [product];
            this.noResultsFound = false;
          } else {
            this.searchResults = [];
            this.noResultsFound = true;
          }
        });
    } else {
      this.productService.searchByName(query)
        .pipe(takeUntil(this.destroy$))
        .subscribe((products) => {
          this.isSearching = false;
          this.searchResults = products;
          this.noResultsFound = products.length === 0;
        });
    }
  }

  private resetSearch(): void {
    this.searchResults = [];
    this.noResultsFound = false;
    this.selectedProduct = null;
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.router.navigate(['/product', product.barcode]);
  }

  clearSearch(): void {
    this.searchControl.reset();
    this.resetSearch();
  }

  createNewProduct(): void {
    console.log('Create new product');
    // TODO: Navigate to product creation form
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
