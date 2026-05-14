import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '../../core/services/supabase.service';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  image_url?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private supabaseService: SupabaseService) {}

  searchByName(query: string): Observable<Product[]> {
    return from(
      this.supabaseService.client
        .from('Products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(50),
    ).pipe(
      map((response) => {
        if (response.error) {
          console.error('Search error:', response.error);
          return [];
        }
        return response.data as Product[];
      }),
    );
  }

  searchByBarcode(barcode: string): Observable<Product | null> {
    return from(
      this.supabaseService.client
        .from('Products')
        .select('*')
        .eq('barcode', barcode)
        .single(),
    ).pipe(
      map((response) => {
        if (response.error) {
          console.debug('Product not found:', response.error);
          return null;
        }
        return response.data as Product;
      }),
    );
  }

  getAll(): Observable<Product[]> {
    return from(
      this.supabaseService.client
        .from('Products')
        .select('*')
        .order('name', { ascending: true }),
    ).pipe(
      map((response) => {
        if (response.error) {
          console.error('Fetch error:', response.error);
          return [];
        }
        return response.data as Product[];
      }),
    );
  }

  create(
    product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  ): Observable<Product> {
    return from(
      this.supabaseService.client
        .from('Products')
        .insert([product])
        .select()
        .single(),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as Product;
      }),
    );
  }
}
