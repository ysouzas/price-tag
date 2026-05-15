import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Supermarket, SupermarketService } from '@services/supermarket/supermarket.service';

@Component({
  selector: 'app-supermarket-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './supermarket-search.component.html',
  styleUrl: './supermarket-search.component.scss'
})
export class SupermarketSearchComponent implements OnInit {
  searchControl = new FormControl('');
  allSupermarkets: Supermarket[] = [];
  filteredSupermarkets: Supermarket[] = [];
  isLoading = true;

  constructor(private supermarketService: SupermarketService) {}

  ngOnInit(): void {
    this.supermarketService.getAll().subscribe(markets => {
      this.allSupermarkets = markets;
      this.filteredSupermarkets = markets;
      this.isLoading = false;
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query && query.trim().length > 0) {
        this.filteredSupermarkets = this.allSupermarkets.filter(m =>
          m.name.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        this.filteredSupermarkets = this.allSupermarkets;
      }
    });
  }
}
