import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '../../core/services/supabase.service';

export interface Supermarket {
  id: string;
  name: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupermarketService {
  constructor(private supabaseService: SupabaseService) {}

  getAll(): Observable<Supermarket[]> {
    return from(
      this.supabaseService.client
        .from('Supermarkets')
        .select('*')
        .order('name', { ascending: true }),
    ).pipe(
      map((response) => {
        if (response.error) {
          console.error('Fetch error:', response.error);
          return [];
        }
        return response.data as Supermarket[];
      }),
    );
  }

  create(name: string): Observable<Supermarket> {
    return from(
      this.supabaseService.client
        .from('Supermarkets')
        .insert([{ name }])
        .select()
        .single(),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data as Supermarket;
      }),
    );
  }
}
