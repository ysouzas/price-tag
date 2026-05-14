import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { from } from 'rxjs';
import { PriceHistoryComponent } from '../../components/price-history/price-history.component';
import { SupabaseService } from '../../core/services/supabase.service';
import { Product, ProductService } from '../../services/product/product.service';
import { Supermarket, SupermarketService } from '../../services/supermarket/supermarket.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    TranslateModule,
    PriceHistoryComponent,
    RouterModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild(PriceHistoryComponent) priceHistory!: PriceHistoryComponent;
  product: Product | null = null;
  supermarkets: Supermarket[] = [];
  priceForm!: FormGroup;
  isLoading = true;
  isSaving = false;

  get barcode(): string {
    return this.route.snapshot.paramMap.get('barcode') ?? '';
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private supermarketService: SupermarketService,
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.priceForm = this.fb.group({
      supermarket_id: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
    });

    this.productService.searchByBarcode(this.barcode).subscribe(product => {
      this.product = product;
      this.isLoading = false;
    });

    this.supermarketService.getAll().subscribe(markets => {
      this.supermarkets = markets;
    });
  }

  savePrice(): void {
    if (this.priceForm.invalid) return;
    this.isSaving = true;

    const { supermarket_id, price } = this.priceForm.value;
    const entry = {
      product_id: this.product?.id,
      product_barcode: this.barcode,
      supermarket_id,
      price: parseFloat(price),
      purchased_at: new Date().toISOString(),
    };

    from(
      this.supabaseService.client.from('Purchases').insert([entry])
    ).subscribe(res => {
      this.isSaving = false;
      if (res.error) {
        this.snackBar.open('Error saving price', 'OK', { duration: 3000 });
      } else {
        this.priceForm.reset();
        this.snackBar.open('Price saved!', 'OK', { duration: 2000 });
        this.priceHistory.loadPurchases();
      }
    });
  }
}
