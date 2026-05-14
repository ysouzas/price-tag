import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ 'PRODUCTS.TITLE' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>{{ 'PRODUCTS.DESCRIPTION' | translate }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 16px;
      }
    `,
  ],
})
export class ProductsComponent {}
