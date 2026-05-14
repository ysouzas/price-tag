import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '../../core/services/supabase.service';

export interface Purchase {
  id: string;
  product_barcode: string;
  supermarket_id: string;
  purchase_date: string;
  price_at_purchase: number;
  supermarket?: { name: string };
}

@Component({
  selector: 'app-price-history',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './price-history.component.html',
  styleUrl: './price-history.component.scss'
})
export class PriceHistoryComponent implements OnInit {
  @Input({ required: true }) barcode!: string;

  purchases: Purchase[] = [];
  isLoading = true;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    from(
      this.supabaseService.client
        .from('Purchases')
        .select('*, supermarket:Supermarkets(name)')
        .eq('product_barcode', this.barcode)
        .order('purchase_date', { ascending: false })
        .limit(20)
    ).pipe(
      map(res => {
        if (res.error) { console.error(res.error); return []; }
        return res.data as Purchase[];
      })
    ).subscribe(data => {
      this.purchases = data;
      this.isLoading = false;
    });
  }
}
